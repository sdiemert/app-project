/**
 * Created by sdiemert on 2016-08-17.
 *
 * Main Angular app entry point.
 */

var app = angular.module("app", ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider){

    // For any unmatched url, send to /route1
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('landing', {
            url: "/",
            templateUrl: "views/landing.html",
            controller:"landingController"

        })
        .state('route2', {
            url: "/route2",
            templateUrl: "views/route2.html",
            controller:"route2Controller"
        })
});

app.service("apiService", apiService);

app.controller("mainController", ["$scope", "$state","apiService", mainController]);
app.controller("landingController", ["$scope", landingController]);
app.controller("route2Controller", ["$scope", route2Controller]);

