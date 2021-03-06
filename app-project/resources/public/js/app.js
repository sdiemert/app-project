"use strict";
/**
 * Created by sdiemert on 2016-08-17.
 *
 * Main Angular app entry point.
 */

var app = angular.module("app", ['ui.router', 'base64']);

app.config(function($stateProvider, $urlRouterProvider){

    // For any unmatched url, send to /route1
    $urlRouterProvider.otherwise("/landing");

    $stateProvider
        .state('landing', {
            url: "/landing",
            templateUrl: "views/landing.html",
            controller:"landingController"

        })
        .state('consent', {
            url: "/consent",
            templateUrl: "views/consent.html",
            controller:"consentController"
        })
        .state('survey', {
            url: "/survey/{questionNum:int}",
            templateUrl: "views/survey.html",
            controller:"surveyController"
        })
        .state('tutorial', {
            url: "/tutorial",
            templateUrl: "views/tutorial.html",
            controller:"tutorialController"
        })
        .state('exit', {
            url: "/exit",
            templateUrl: "views/exit.html"
        })
        .state('begin', {
            url: "/begin",
            templateUrl: "views/begin.html"
        })
        .state('beginSurvey', {
            url: "/beginSurvey",
            templateUrl: "views/beginSurvey.html"
        })
        .state('doneSurvey', {
            url: "/doneSurvey",
            templateUrl: "views/doneSurvey.html"
        })
        .state('doneTimelines', {
            url: "/doneTimelines",
            templateUrl: "views/doneTimelines.html"
        })
        .state('question', {
            url: "/question/{questionNum:int}",
            templateUrl: "views/question.html",
            controller : "questionController"
        })
        .state('end', {
            url: "/end",
            templateUrl: "views/end.html"
        })
});

app.service("apiService", ["$http", "$base64", apiService]);

app.controller("mainController", ["$scope", "$rootScope", "$state","apiService", mainController]);
app.controller("landingController", ["$scope", "apiService", landingController]);
app.controller("consentController", ["$scope", "$rootScope", "$state","apiService", consentController]);
app.controller("tutorialController", ["$scope", "$rootScope", "$state","apiService", tutorialController]);
app.controller("svgController", ["$scope", "$rootScope", "$state", "apiService", svgController]);
app.controller("questionController", ["$scope", "$rootScope", "$state", "apiService", questionController]);
app.controller("surveyController", ["$scope","$rootScope", "$state", "apiService", surveyController]);


app.run(function($rootScope, $state, $location){

    $rootScope.$on("$stateChangeStart", function(event, toState, params, fromState){

        console.log("api key: "+ $rootScope.key);
        console.log("toState: "+ toState.name);

        if(!$rootScope.key && toState.name !== "landing"){
            console.log("attempting to go to state: landing");
            $state.go("landing");
            event.preventDefault();
        }
    });

});
