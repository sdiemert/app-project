function surveyController ($scope, $rootScope, $state, apiService){

    $scope.qNums = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];

    var BEFORE_SURVEY_START = 0, BEFORE_SURVEY_END = 12, AFTER_SURVEY_START = 13, AFTER_SURVEY_END = 14;

    var FADE_TIME = 300;

    $scope.isCompoundQuestion = function(x){
        return (x === 11 || x === 12);
    };

    $scope.showQuestion = function(x){
        $("#q"+x).add($("#next-button")).add($("#back-button")).fadeIn(FADE_TIME);
    };

    $scope.hideAllQuestions = function(f){

        for(var i = 1; i < $scope.qNums.length; i++){
            $("#q"+$scope.qNums[i]).removeClass("input-error").hide();
            $("#q"+$scope.qNums[i]+"-other").removeClass("input-error").hide();
        }

        $("#next-button").hide();
        $("#back-button").hide();

    };

    $scope.showOther = function(x){

        var v = $("#q"+x+"-input").val();
        if(v === "other" || v === "yes"){
            $("#q"+x+"-other").fadeIn(FADE_TIME);
        }else{
            $("#q"+x+"-other").fadeOut(FADE_TIME);
        }
    };

    $scope.fadeOutQuestion = function(x, cb){

        $("#q"+x).fadeOut(FADE_TIME);
        //$("#back-button").fadeOut(FADE_TIME);
        $("#next-button").fadeOut(FADE_TIME, cb);

    };

    $scope.init = function(){

        $scope.questionNum = $state.params['questionNum'];

        if($scope.qNums.indexOf($scope.questionNum) === -1){
            $state.go("landing");
            return;
        }

        $scope.hideAllQuestions();
        $scope.showQuestion($scope.qNums[$scope.questionNum]);

        $scope.response = "null-answer";


    };

    $scope.showQuestionError = function(x, s){

        if($scope.isCompoundQuestion(x)){
            $("#q"+x+"-"+s).addClass("input-error");
        }else{
            $("#q"+x+"-input").addClass("input-error");
            $("#q"+x+"-other").addClass("input-error");
        }


    };

    $scope.goBack = function(){

        $scope.fadeOutQuestion($scope.qNums[$scope.questionNum], function() {
            if ($scope.questionNum === BEFORE_SURVEY_START) {
                return $state.go("survey", {questionNum: BEFORE_SURVEY_START});
            } else if ($scope.questionNum === AFTER_SURVEY_START) {
                return $state.go("survey", {questionNum: AFTER_SURVEY_END});
            } else {
                return $state.go("survey", {questionNum: $scope.questionNum - 1});
            }
        });

    };

    $scope.goNext = function(){

        var OK = function(){

            $scope.fadeOutQuestion($scope.qNums[$scope.questionNum], function(){

                if($scope.questionNum === BEFORE_SURVEY_END){
                    return $state.go("doneSurvey");
                }else if($scope.questionNum === AFTER_SURVEY_END){
                    return $state.go("end");
                }else{
                    return $state.go("survey", {questionNum: $scope.questionNum + 1});
                }
            });
        };

        var ERR = function(s){
            $scope.showQuestionError($scope.qNums[$scope.questionNum], s);
        };

        $scope.submitResponse($scope.qNums[$scope.questionNum], OK, ERR);

    };

    $scope.submitResponse = function(q, doneCb, errCb){

        var v = null, o = null;

        if($scope.isCompoundQuestion(q)){
            // these are joint questions, several answers must be processed.

            var NUM_SUB_QUESTIONS = 8;

            var vals = [];

            for(var i = 1; i <= NUM_SUB_QUESTIONS; i++){
                v = $("input[name='q"+q+"-"+i+"']:checked").val();
                if(v === undefined){
                    return errCb(i);
                }else{
                    $("#q"+q+"-"+i).removeClass("input-error");
                    vals.push({s : i, v : v});
                }
            }

            async.eachSeries(vals, function(d, cb){
                apiService.sendSurveyResponse(q+"-"+d.s, d.v, null, $rootScope.key, function(err){
                    cb(err)
                });
            }, function(err){
                doneCb();
            });
            
        }else{
            // single answer question (with possible "other") option.
            v = $("#q"+q+"-input :selected").val() || $("#q"+q+"-input").val() ;
            o = $("#q"+q+"-other").val();

            if(v === undefined || v === null || v === "null-answer" || v === "") {
                return errCb();
            }else if (v === "other" && !o){
                return errCb();
            }else{
                apiService.sendSurveyResponse(q, v, o, $rootScope.key, function(err){
                    doneCb();
                });
            }
        }

    };


    $scope.init();

}