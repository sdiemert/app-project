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
     * The participant wishes to exit the study - they will not be able to participate again.
     * Must double check with a pop-up that they are sure.
     */
    $scope.exitStudy = function(status){

        var resp = confirm("Are you sure you would like to exit the study? You will be unable to continue later.");

        if(resp === true){
            apiService.exitStudy($rootScope.username, $rootScope.password, status, function(err){

                $rootScope.username = null;
                $rootScope.password = null;
                $rootScope.authorized = null;
                $rootScope.consent = null;

                $state.go("exit");
            });
        }

    };

    /**
     * The participate has completed the study, delete their stored credentials.
     * Also, write a "completion of study" to the web server.

     */
    $scope.doneStudy = function(){

        apiService.doneStudy($rootScope.username, $rootScope.password, function(err){

            $rootScope.username = null;
            $rootScope.password = null;
            $rootScope.authorized = null;
            $rootScope.consent = null;

            $state.go("end");
        });

    };


}