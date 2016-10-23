/**
 * Created by sdiemert on 2016-08-17.
 *
 * Main Controller - Loaded on index.html page.
 */

 function mainController ($scope, $rootScope, $state, apiService){

    $scope.login = function(){

        apiService.getKey(function(err){

            if(!err){

                $state.go("consent");

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

    /**
     * The participant wishes to exit the study - they will not be able to participate again.
     * Must double check with a pop-up that they are sure.
     */
    $scope.exitStudy = function(status){

        var resp = confirm("Are you sure you would like to exit the study? You will be unable to continue later.");

        if(resp === true){
            $state.go("exit");
        }

    };

    /**
     * The participate has completed the study, delete their stored credentials.
     * Also, write a "completion of study" to the web server.

     */
    $scope.doneStudy = function(){
        $state.go("end");
    };


}