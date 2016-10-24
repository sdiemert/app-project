function surveyController ($scope, $rootScope, $state, apiService){

    
    $scope.init = function(){

        $scope.questionNumber = $state.params['questionNum'];

    };


    $scope.init();

}