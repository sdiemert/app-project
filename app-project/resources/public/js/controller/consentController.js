function consentController ($scope, $rootScope, $state){

    $scope.consentAgree = function(){
        $rootScope.consent = true;
        $state.go("tutorial");
    };

    $scope.consentDisagree = function(){
        $rootScope.authorized = false;
        $rootScope.consent = false;
        $state.go("landing");
    };

}