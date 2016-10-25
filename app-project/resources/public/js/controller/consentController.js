function consentController ($scope, $rootScope, $state, apiService){

    $scope.init = function(){

        if($rootScope.key === null){
            $state.go("landing");
        }

    };

    $scope.consentAgree = function(){

        console.log("consentController.consentAgree()");

        apiService.sendConsent($rootScope.key, true, function(err){

            if(err){
                $rootScope.key = null;
                $state.go("landing");
            }else{
                $rootScope.consent = true;
                $state.go("beginSurvey");
            }
        });

    };

    $scope.consentDisagree = function(){

        console.log("consentController.consentDisagree()");

        apiService.sendConsent($rootScope.key, false, function(err){

            $rootScope.key = null;
            $rootScope.consent = false;
            $state.go("exit");

        });
        
        $state.go("landing");
    };

    $scope.init();

}