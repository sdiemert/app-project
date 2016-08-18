/**
 * Created by sdiemert on 2016-08-18.
 */

function apiService($http, $base64){

    /**
     * Returns the string required for basic authorization 
     * to be included in an Authorization HTTP header.
     *
     * @param user {string}
     * @param pass {string}
     * @returns {string} base64 encoded string.
     */
    var makeAuth = function(user, pass){
        return "Basic "+$base64.encode(user+":"+pass);
    };

    /**
     * Authenticates the user, checks that username and password are valid.
     * Access the public auth API route.
     *
     * @param user {string} - username to authenticate with
     * @param pass {string} - password for the username
     * @param cb {function}
     */
    this.auth = function(user, pass, cb){
        
        $http({
            method : "POST",
            url : "/api/auth",
            headers : {
                "Content-Type" : "application/json"
            },
            data : {
                "username" : user,
                "password" : pass
            }
        }).then(function success(resp){

            console.log("auth success");
            console.log(resp);

            cb(null);

        }, function error(resp){

            console.log("auth failed");
            console.log(resp);

            if(resp.status === 400){
                cb("BAD_REQUEST", null);
            }else if(resp.status === 401){
                cb("AUTH_FAILED", null);
            }else{
                cb("ERROR", null);
            }
            
        });
    };

    /**
     * Makes a request to /api/consent to register whether or not the
     * designated user consents to the study.
     *
     * @param user
     * @param pass
     * @param accept
     * @param cb
     */
    this.sendConsent = function(user, pass, accept, cb){

        $http({
            method : "POST",
            url : "/api/consent",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : makeAuth(user, pass)
            },
            data : {
                "username" : user,
                "consent" : accept
            }
        }).then(function success(resp){
            cb(null);
        }, function error(resp){
            cb("error");

        });

    }

}
