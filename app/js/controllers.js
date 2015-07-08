'use strict';

/* Controllers */

var buytSaigonControllers = angular.module('BuytSaigonControllers', ['firebase', 'angucomplete-alt', 'BuytSaigonServices']);



// Original
buytSaigonControllers.controller('StopSearchCtrl', ['$scope', '$firebaseArray', 'FindBusService', 'MapDisplayService', function ($scope, $firebaseArray, FindBusService, MapDisplayService) {
    var stopsData = new Firebase('https://nogiastyub.firebaseio.com/stops'),
        busesData = new Firebase('https://nogiastyub.firebaseio.com/buses'),
        map;
        
    $scope.allStops = $firebaseArray(stopsData);
    $scope.allBuses = $firebaseArray(busesData);
    $scope.mapCenter = {'latitude' : 10.762622, 'longitude' : 106.660172}; // Sai Gon's coordinates
    
    
    // Get the map after page finishes loading
    $scope.$on('mapInitialized', function (event, theMap) {
        map = theMap;
    });
    
    
    
    $scope.findBusAndMarkStops = function () {
        
        $scope.results = FindBusService.getBusResults($scope.selectedDeparture.originalObject,
                                                      $scope.selectedArrival.originalObject,
                                                      $scope.allStops,
                                                      $scope.allBuses);
        
        
        $scope.departureCoordinates = MapDisplayService.getCoordinates($scope.selectedDeparture.originalObject);
        $scope.arrivalCoordinates = MapDisplayService.getCoordinates($scope.selectedArrival.originalObject);
        $scope.stopsCoordinates = [$scope.departureCoordinates, $scope.arrivalCoordinates];
        
        
        // Zoom in the selected stops
        var bounds = new google.maps.LatLngBounds();
        for (var i=0; i<$scope.stopsCoordinates.length; i++) {
            var latlng = new google.maps.LatLng($scope.stopsCoordinates[i].latitude, $scope.stopsCoordinates[i].longitude);
            bounds.extend(latlng);
        }
        map.setCenter(bounds.getCenter());
        map.fitBounds(bounds);

    };
    
    
    
    $scope.showRoute = function (instructions) {
        $scope.route = MapDisplayService.showRoute(instructions,
                                                   $scope.departureCoordinates,
                                                   $scope.arrivalCoordinates,
                                                   $scope.allStops,
                                                   $scope.allBuses);
    };
        
}]);