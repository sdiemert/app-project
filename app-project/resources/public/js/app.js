/**
 * Created by sdiemert on 2016-08-17.
 *
 * Main Angular app entry point.
 */

var app = angular.module("app", ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider){

    // For any unmatched url, send to /route1
    $urlRouterProvider.otherwise("/route1");

    $stateProvider
        .state('route1', {
            url: "/route1",
            templateUrl: "views/route1.html",
            controller:"route1Controller"

        })
        .state('route2', {
            url: "/route2",
            templateUrl: "views/route2.html",
            controller:"route2Controller"
        })
});

app.controller("mainController", ["$scope", mainController]);
app.controller("route1Controller", ["$scope", route1Controller]);
app.controller("route2Controller", ["$scope", route2Controller]);

