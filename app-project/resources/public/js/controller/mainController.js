/**
 * Created by sdiemert on 2016-08-17.
 */

 function mainController ($scope, $rootScope, $state, apiService){

    $scope.login = function(){
        
        var username = $("#login-username").val();
        var password = $("#login-password").val();
        
        apiService.auth(username, password, function(err){

            if(!err){

                $rootScope.username = username;
                $rootScope.password = password;
                $rootScope.authorized = true;

                $state.go("consent");

            }else{

                $rootScope.authorized = false;

                switch(err){
                    case "AUTH_FAILED":
                        $scope.showAuthFailed();
                        break;
                    case "BAD_REQUEST":
                        $scope.showAuthError();
                        break;
                    case "ERROR":
                        $scope.showAuthError();
                        break;
                    default:
                        $scope.showAuthError();
                        break;
                }
            }

        });
    };

    $scope.showAuthFailed = function(){
        $("#login-auth-failed").show();
    };

    $scope.showAuthError = function(){
        $("#login-auth-error").show();
    };

    /**
     * The participant wishes to exit the study.
     * Must double check with a pop-up that they are sure.
     */
    $scope.exitStudy = function(status){

        var resp = confirm("Are you sure you would like to exit the study? You will be unable to continue later.");

        if(resp === true){
            apiService.exitStudy($rootScope.username, $rootScope.password, status, function(err){
                $state.go("exit");
            });
        }

    };
}