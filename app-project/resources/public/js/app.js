/**
 * Created by sdiemert on 2016-08-17.
 *
 * Main Angular app entry point.
 */

var app = angular.module("app", ['ui.router']);

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
        .state('tutorial', {
        url: "/tutorial",
        templateUrl: "views/tutorial.html",
        controller:"tutorialController"
    })
});

app.service("apiService", apiService);

app.controller("mainController", ["$scope", "$rootScope", "$state","apiService", mainController]);
app.controller("landingController", ["$scope", "apiService", landingController]);
app.controller("consentController", ["$scope", "$rootScope", "$state","apiService", consentController]);

app.run(function($rootScope, $state, $location){

    $rootScope.$on("$stateChangeStart", function(event, toState, params, fromState){

        console.log("authorized: "+ $rootScope.authorized);
        console.log("toState: "+ toState.name);

        if(!$rootScope.authorized && toState.name !== "landing"){
            console.log("attempting to go to state: landing");
            $state.go("landing");
            event.preventDefault();
            return;
        }
    });

});

