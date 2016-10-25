/**
 * Created by sdiemert on 2016-08-18.
 */

function apiService($http, $base64){


    this.getKey = function(cb){

        $http({
            method : "GET",
            url : "/api/key"
        }).then(function success(resp){

            console.log(resp.data);

            cb(resp.data, null);
        }, function error(resp){
            cb(null, "error");
        });

    };

    /**
     * Makes a request to /api/consent to register whether or not the
     * designated user consents to the study.
     *
     * @param uuid {string}
     * @param accept {boolean}
     * @param cb {function}
     */
    this.sendConsent = function(uuid, accept, cb){

        $http({
            method : "POST",
            url : "/api/"+uuid+"/consent",
            headers : {
                "Content-Type" : "application/json"
            },
            data : {
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
     * @param uuid {string}
     * @param status {string,number} denotes the state/status of the app when they exited (e.g. question number).
     * @param cb {function}
     */
    this.exitStudy = function(uuid, status, cb){

        $http({
            method : "POST",
            url : "/api/"+uuid+"/exit",
            headers : {
                "Content-Type" : "application/json"
            },
            data : {
                "username" : uuid,
                "exit-status" : status
            }
        }).then(function success(resp){
            cb(null);
        }, function error(resp){
            cb("error");
        });
    };

    /**
     * Marks the study as completed.
     * @param uuid {string}
     * @param cb {function}
     */
    this.doneStudy = function(uuid, cb){

        $http({
            method : "POST",
            url : "/api/"+uuid+"/done",
            headers : {
                "Content-Type" : "application/json"
            },
            data : {
                "username" : uuid
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
    this.getTimeline = function(uuid, id, cb){

        $http({
            method : "GET",
            headers : {
                "Content-Type" : "application/json"
            },
            url : "/api/"+uuid+"/timeline/"+id
        }).then(function success(resp){

            var events = [];

            for(var i = 0; i < resp.data.events.length; i++){
                events.push(new Event(resp.data.events[i].time, resp.data.events[i].dose));
            }

            cb(new SliderTimeline(resp.data.hours, events, resp.data.rx, resp.data.description, resp.data.interval));

        }, function error(resp){
            console.log("Got error response back", resp);
            cb(null);
        });

    };

    /**
     * Sends question answer data back to the server
     * @param id {number} the question number
     * @param timeline {SliderTimeline}
     * @param uuid {string} username to associate the response to
     * @param cb {function} called when the request is done.
     */
    this.sendResponse = function(id, timeline, uuid, cb){

        $http({
            method : "POST",
            url : "/api/"+uuid+"/question/"+id,
            headers : {
                "Content-Type" : "application/json"
            },
            data : {
                "username" : uuid,
                "answer-lower": timeline.left,
                "answer-upper" : timeline.right
            }
        }).then(function success(resp){
            cb(resp.data);
        }, function error(resp){
            cb(null);
        });

    };

    /**
     *
     * @param id {string | number} the identifier of the survey question.
     * @param resp {string} the response to the survey question
     * @param other {string} any "other" information provided by the user, may be null.
     * @param uuid {string} the user's identifier
     * @param cb {function}
     */
    this.sendSurveyResponse = function(id, resp, other, uuid, cb){

        $http({
            method : "POST",
            url : "/api/"+uuid+"/survey/"+id,
            headers : {
                "Content-Type" : "application/json"
            },
            data : {
                answer : resp,
                additional: other
            }
        }).then(function success(resp){
            cb(null);
        }, function error(resp){
            cb("ERROR");
        });


    }

}