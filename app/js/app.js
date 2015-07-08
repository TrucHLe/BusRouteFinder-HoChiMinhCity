'use strict';

/* App Module */

var buytSaigonApp = angular.module('BuytSaigonApp', ['ngRoute', 'BuytSaigonControllers', 'BuytSaigonFilters', 'ngMap']);


// Original
buytSaigonApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/stop-search', {
            templateUrl: 'partials/stop-search.html',
            controller: 'StopSearchCtrl'
        })
        .when('/stop-search/:busID', {
            templateUrl: 'partials/bus-detail.html',
            controller: 'BusDetailCtrl'
        })
        .otherwise({
            redirectTo: '/stop-search'
        });
}]);