/**
 * Created by sdiemert on 2016-08-18.
 */

function apiService($http, $base64){

    var makeAuth = function(user, pass){

        var val = "Basic "+$base64.encode(user+":"+pass);

        console.log(val);

        return val;
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

        console.log("attempting auth: "+user+","+pass);

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
