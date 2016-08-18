function consentController ($scope, $rootScope, $state, apiService){

    $scope.consentAgree = function(){

        console.log("consentController.consentAgree()");

        apiService.sendConsent($rootScope.username, $rootScope.password, true, function(err){

            if(err){
                $rootScope.authorized = false;
                $rootScope.username = null;
                $rootScope.password = null;
                $state.go("landing");
            }else{
                $rootScope.consent = true;
                $state.go("tutorial");
            }
        });

    };

    $scope.consentDisagree = function(){

        console.log("consentController.consentDisagree()");

        apiService.sendConsent($rootScope.username, $rootScope.password, false, function(err){

            $rootScope.authorized = false;
            $rootScope.consent = false;
            $rootScope.username = null;
            $rootScope.password = null;
            $state.go("landing");

        });
        
        $state.go("landing");
    };

}