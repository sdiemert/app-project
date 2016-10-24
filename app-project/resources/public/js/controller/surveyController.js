function surveyController ($scope, $rootScope, $state, apiService){

    $scope.qNums = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];

    var BEFORE_SURVEY_START = 0, BEFORE_SURVEY_END = 12, AFTER_SURVEY_START = 13, AFTER_SURVEY_END = 14;

    $scope.showQuestion = function(x){
        $("#q"+x).show();
    };

    $scope.hideAllQuestions = function(){
        for(var i = 0; i < $scope.qNums.length; i++){
            $("#q"+$scope.qNums[i]).hide();
            $("#q"+$scope.qNums[i]+"-other").hide();
        }
    };

    $scope.showOther = function(x){

        var v = $("#q"+x+"-input").val();
        if(v === "other" || v === "yes"){
            $("#q"+x+"-other").show();
        }else{
            $("#q"+x+"-other").hide();
        }
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

        if($scope.questionNum === BEFORE_SURVEY_START){
            return $state.go("survey", {questionNum : BEFORE_SURVEY_START});
        }else if($scope.questionNum === AFTER_SURVEY_START){
            return $state.go("survey", {questionNum : AFTER_SURVEY_END});
        }else{
            return $state.go("survey", {questionNum: $scope.questionNum - 1});
        }

    };

    $scope.goNext = function(){

        if($scope.questionNum === BEFORE_SURVEY_END){
            return $state.go("tutorial");
        }else if($scope.questionNum === AFTER_SURVEY_END){
            return $state.go("end");
        }else{
            return $state.go("survey", {questionNum: $scope.questionNum + 1});
        }

    };


    $scope.init();

}