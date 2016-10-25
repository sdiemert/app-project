/**
 * Created by sdiemert on 2016-08-17.
 *
 * Main Controller - Loaded on index.html page.
 */

 function mainController ($scope, $rootScope, $state, apiService){

    $scope.login = function(){

        apiService.getKey(function(k, err){

            if(!err){
                $rootScope.key = k;
                $state.go("consent");

            }else{

                console.log("ERROR: no api key");
                console.log("ERROR: " + err);

            }

        });
    };

    /**
     * The participant wishes to exit the study - they will not be able to participate again.
     * Must double check with a pop-up that they are sure.
     */
    $scope.exitStudy = function(status){

        var resp = confirm("Are you sure you would like to exit the study? You will not be able to continue later.");

        if(resp === true){

            apiService.exitStudy($rootScope.key,status, function(err) {
                $rootScope.key = null;
                $rootScope.consent = false;
                $state.go("exit");
            });
        }

    };

    /**
     * The participate has completed the study, delete their stored credentials.
     * Also, write a "completion of study" to the web server.

     */
    $scope.doneStudy = function(){

        apiService.doneStudy($rootScope.key, function(err) {
            $rootScope.key = null;
            $rootScope.consent = false;
            $state.go("end");
        });
    };


}