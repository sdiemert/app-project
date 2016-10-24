function consentController ($scope, $rootScope, $state, apiService){

    $scope.consentAgree = function(){

        console.log("consentController.consentAgree()");

        apiService.sendConsent($rootScope.key, true, function(err){

            if(err){
                $rootScope.key = null;
                $state.go("landing");
            }else{
                $rootScope.consent = true;
                $state.go("tutorial");
            }
        });

    };

    $scope.consentDisagree = function(){

        console.log("consentController.consentDisagree()");

        apiService.sendConsent($rootScope.key, false, function(err){

            $rootScope.key = null;
            $rootScope.consent = false;
            $state.go("landing");

        });
        
        $state.go("landing");
    };

}