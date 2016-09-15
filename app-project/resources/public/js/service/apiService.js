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

    };

    /**
     * Marks the user as having requested to exit the study.
     * @param user {string}
     * @param pass {string}
     * @param status {string,number} denotes the state/status of the app when they exited (e.g. question number).
     * @param cb {function}
     */
    this.exitStudy = function(user, pass, status, cb){

        $http({
            method : "POST",
            url : "/api/exit",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : makeAuth(user, pass)
            },
            data : {
                "username" : user,
                "exit-status" : status
            }
        }).then(function success(resp){
            cb(null);
        }, function error(resp){
            cb("error");
        });
    };

    /**
     * Fetches a timeline from the server.
     * @param id {number} the id of the timeline to fetch.
     * @param cb {function} called when complete with the timeline as the parameter or null.
     */
    this.getTimeline = function(id, cb){

        $http({
            method : "GET",
            url : "/api/timeline/"+id
        }).then(function success(resp){

            var events = [];

            for(var i = 0; i < resp.data.events.length; i++){
                events.push(new Event(resp.data.events[i].time, resp.data.events[i].dose));
            }

            cb(new SliderTimeline(resp.data.hours, events, resp.data.rx, resp.data.description));

        }, function error(resp){
            cb(null);
        });

    };

    /**
     * Sends question answer data back to the server
     * @param id {number} the question number
     * @param timeline {SliderTimeline}
     * @param user {string} username to associate the response to
     * @param pass {string} the users password
     * @param cb {function} called when the request is done.
     */
    this.sendResponse = function(id, timeline, user, pass, cb){

        $http({
            method : "POST",
            url : "/api/question/"+id,
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : makeAuth(user, pass)
            },
            data : {
                "username" : user,
                "answer-lower": timeline.left,
                "answer-upper" : timeline.right
            }
        }).then(function success(resp){
            cb(resp.data);
        }, function error(resp){
            cb("error");
        });

    }

}
