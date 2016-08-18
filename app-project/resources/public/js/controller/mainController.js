/**
 * Created by sdiemert on 2016-08-17.
 */

 function mainController ($scope, $state, apiService){

    $scope.login = function(){
        
        var username = $("#login-username").val();
        var password = $("#login-password").val();
        
        apiService.auth(username, password, function(err){

            if(!err){

                $state.go("route2");

            }else{
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
}