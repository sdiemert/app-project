function surveyController ($scope, $rootScope, $state, apiService){

    $scope.qNums = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];

    var BEFORE_SURVEY_START = 0, BEFORE_SURVEY_END = 12, AFTER_SURVEY_START = 13, AFTER_SURVEY_END = 14;

    var FADE_TIME = 300;

    $scope.showQuestion = function(x){
        $("#q"+x).add($("#next-button")).add($("#back-button")).fadeIn(FADE_TIME);
    };

    $scope.hideAllQuestions = function(f){

        for(var i = 1; i < $scope.qNums.length; i++){
            $("#q"+$scope.qNums[i]).hide();
            $("#q"+$scope.qNums[i]+"-other").hide();
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
        $("#next-button").fadeOut(FADE_TIME);
        $("#back-button").fadeOut(FADE_TIME, cb);
    };

    $scope.init = function(){

        $scope.questionNum = $state.params['questionNum'];

        if($scope.qNums.indexOf($scope.questionNum) === -1){
            $state.go("landing");
            return;
        }

        $scope.hideAllQuestions();
        $scope.showQuestion($scope.qNums[$scope.questionNum]);


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

        $scope.fadeOutQuestion($scope.qNums[$scope.questionNum], function(){
            if($scope.questionNum === BEFORE_SURVEY_END){
                return $state.go("tutorial");
            }else if($scope.questionNum === AFTER_SURVEY_END){
                return $state.go("end");
            }else{
                return $state.go("survey", {questionNum: $scope.questionNum + 1});
            }
        });


    };


    $scope.init();

}