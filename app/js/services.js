'use strict';

/* Services */

var buytSaigonServices = angular.module('BuytSaigonServices', ['angucomplete-alt']);



//------------------------------------------------------------------
// Find Bus Service
//
buytSaigonServices.service('FindBusService', function () {
    
    var sameInputs = [[{'directive' : 'Trạm Đi = Trạm Đến. Nhập lại nha :)',
                        'means': ''}]],
        noResult = [[{'directive' : 'Không có tuyến Buýt này. Xin nhập tên trạm khác',
                      'means' : ''}]];
        
    
    
    //------------------------------------------------------------------
    // Find Bus
    //
    this.findBus = function (departure, arrival, allStops, allBuses) {
        
        if (departure !== arrival) {
            
            if (this.matchBus(departure, arrival) !== null) {
                return this.findOneBusTrip(departure, arrival);
            } else {
                return this.findTwoBusTrip(departure, arrival, allStops, allBuses);
            }
        } else {
            return 'same inputs';
        }
    };
    
    
    
    //------------------------------------------------------------------
    // Get Bus Results
    //
    this.getBusResults = function(departure, arrival, allStops, allBuses) {
        var trip = this.findBus(departure, arrival, allStops, allBuses),
            results = [];
        
        
        if (trip === 'same inputs') {
            return sameInputs;
        }
        
        if (trip.routes[0].bus.length === 1) {
            
            // Render One-Bus Trip    
            for (var i = 0; i < trip.routes.length; i++) {
                var oneBusResults = [];
                
                for (var j = 0; j < trip.routes[i].bus.length; j++) {
                    oneBusResults.push({'directive' : 'Chuyến',
                                        'means' : trip.routes[i].bus[j]});
                }
                results.push(oneBusResults);
            }
            return results;
            
        } else if (trip.routes[0].bus.length === 2) {
            
            // Render Two-Bus Trip
            for (var i = 0; i < trip.routes.length; i++) {
                var twoBusResults = [];
                
                for (var j = 0; j < trip.routes[i].bus.length; j++) {
                    
                    if (j%2 === 0) {
                        twoBusResults.push({'directive' : 'Đi chuyến',
                                            'means' : trip.routes[i].bus[j]});
                    } else {
                        twoBusResults.push({'directive' : 'Đổi sang chuyến',
                                            'means' : trip.routes[i].bus[j]});
                    }
                    
                    if (j === 0) {
                        twoBusResults.push({'directive' : 'Đến',
                                            'means' : trip.routes[i].transit[j].type + ' ' + trip.routes[i].transit[j].name,
                                            'address' : trip.routes[i].transit[j].address + ', ' +
                                                        trip.routes[i].transit[j].street + ', ' + 
                                                        trip.routes[i].transit[j].district});
                    }
                }
                results.push(twoBusResults);
            }
            return results;
        }
            
    };

    
    
    //------------------------------------------------------------------
    // Find One-Bus Trip
    //
    this.findOneBusTrip = function (departure, arrival) {
        var matchedBuses = this.matchBus(departure, arrival),
            results = {'from' : departure,
                       'to' : arrival,
                       'routes' : []};
        
        for (var i = 0; i < matchedBuses.length; i++) {
            results.routes.push({'bus' : [matchedBuses[i]],
                                 'transit' : []});
        }
        return results;
    };
    
    
    
    //------------------------------------------------------------------
    // Find Two-Bus Trip
    //
    this.findTwoBusTrip = function (departure, arrival, allStops, allBuses) {
        var results = {'from' : departure,
                       'to' : arrival,
                       'routes' : []};
                
        for (var i = 0; i < departure.bus.length; i++) {
            for (var j=0; j < arrival.bus.length; j++) {
                
                if (this.matchStop(departure.bus[i], arrival.bus[j], allStops, allBuses) !== null) {
                    
                    var matchedStops = this.matchStop(departure.bus[i], arrival.bus[j], allStops, allBuses);        
                    
                    for (var z = 0; z < matchedStops.length; z++) {
                        results.routes.push({'bus' : [departure.bus[i], arrival.bus[j]],
                                             'transit' : [matchedStops[z]]});
                    }
                            
                }
            }
        }
        return results;
    }
    
    
    
    //------------------------------------------------------------------
    // Match Bus
    //
    this.matchBus = function (departureStop, arrivalStop) {
        var matchedBuses = [];
        
        // Loop through buses that pass departure and 
        // arrival to find buses that pass both stops.
        for (var i = 0; i < departureStop.bus.length; i++) {
            for (var j = 0; j < arrivalStop.bus.length; j++) {
                
                if (departureStop.bus[i] === arrivalStop.bus[j]) {    
                    matchedBuses.push(departureStop.bus[i]);
                }
                
            }
        }
        
        // Check empty matchedBuses using .length because !== null doesn't work
        if (matchedBuses.length !== 0) {
            return matchedBuses;
        } else {
            return null;
        }      
    };
    
    
    
    //------------------------------------------------------------------
    // Match Stop
    //
    this.matchStop = function (incomingBus, outgoingBus, allStops, allBuses) {
        var matchedStops = [],
            incomingBusItinerary = [],
            outgoingBusItinerary = [];

        
        // Loop through list of all buses to find incoming bus
        // and outgoing bus' itineraries
        for (var i = 0; i < allBuses.length; i++) {
            if (allBuses[i].id === incomingBus) {
                incomingBusItinerary = allBuses[i].itinerary;
            }
            if (allBuses[i].id === outgoingBus) {
                outgoingBusItinerary = allBuses[i].itinerary;
            }
        }
        
        
        // Check if two buses' itineraries have a common stop
        for (var i = 0; i < incomingBusItinerary.length; i++) {
            for (var j = 0; j < outgoingBusItinerary.length; j++) {
                
                if (incomingBusItinerary[i] === outgoingBusItinerary[j]) {
                    
                    // Loop through list of all stops 
                    // to get the common stop object.
                    for (var z = 0; z < allStops.length; z++) {
                        if (allStops[z].id === incomingBusItinerary[i]) {
                            matchedStops.push(allStops[z]);
                        }
                    }
                }
                
            }
        }
        
        
        if (matchedStops.length !== 0) {
            return matchedStops;
        } else {
            return null;
        }
    };  
    
});




//------------------------------------------------------------------
// Map Display Service
//
buytSaigonServices.service('MapDisplayService', function () {
    
    
    //------------------------------------------------------------------
    // Show Route
    //
    this.showRoute = function (instructions, departureCoordinates, arrivalCoordinates, allStops, allBuses) {
        
        if (instructions.length === 1) {
            return this.showBusLine(instructions[0].means, allBuses);
        } else if (instructions.length === 3) {
            return this.showBusLines(instructions[0].means, instructions[2].means, allBuses);
        }
    };
    
    
    
    this.showBusLine = function (busID, allBuses) {
        var busRouteCoordinates = [];
        
        // Find selected bus and get its route coordinates in list of all buses
        for (var i=0; i<allBuses.length; i++) {
            if (allBuses[i].id === busID) {
                
                
                for (var j=0; j<allBuses[i].routeCoordinates.length; j++) {
                    busRouteCoordinates.push([allBuses[i].routeCoordinates[j][1], allBuses[i].routeCoordinates[j][0]]);
                }
                
                return busRouteCoordinates;
            }
        }
        
    };
    
    
    
    this.showBusLines = function (bus1ID, bus2ID, allBuses) {
        var busRouteCoordinates = [];
        
        for (var i=0; i<allBuses.length; i++) {
            if (allBuses[i].id === bus1ID) {
                for (var j=0; j<allBuses[i].routeCoordinates.length; j++) {
                    busRouteCoordinates.push([allBuses[i].routeCoordinates[j][1], allBuses[i].routeCoordinates[j][0]]);
                }
                break;
            }
        }
        
        for (var i=0; i<allBuses.length; i++) {
            if (allBuses[i].id === bus2ID) {
                for (var j=0; j<allBuses[i].routeCoordinates.length; j++) {
                    busRouteCoordinates.push([allBuses[i].routeCoordinates[j][1], allBuses[i].routeCoordinates[j][0]]);
                }
                return busRouteCoordinates;
            }
        }
        
    };
    
    
    //------------------------------------------------------------------
    // Can't use this function but bus route coordinates data isn't precise enough to do matching
    //
    this.showOneBusRoute = function (busID, departureCoordinates, arrivalCoordinates, allBuses) {
        
        var busRouteCoordinates = [],
            result = [],
            foundDepartureCoordinates = false;
        
        
        // Find selected bus and get its route coordinates in list of all buses
        for (var i=0; i<allBuses.length; i++) {
            if (allBuses[i].id === busID) {
                busRouteCoordinates = allBuses[i].routeCoordinates;
                break;
            }
        }
        
        
        // Get path coordinates between departure and arrival
        // Latitude and longitude order in original path data is reversed
        for (var i=0; i<busRouteCoordinates.length; i++) {
            
            if (foundDepartureCoordinates === false &&
                busRouteCoordinates[i][1] === departureCoordinates.latitude &&
                busRouteCoordinates[i][0] === departureCoordinates.longitude) {
                
                foundDepartureCoordinates = true;
            }
            
            if (foundDepartureCoordinates === true) {
                result.push([busRouteCoordinates[i][1], busRouteCoordinates[i][0]]);
            }
            
            if (busRouteCoordinates[i][1] === arrivalCoordinates.latitude &&
                busRouteCoordinates[i][0] === arrivalCoordinates.longitude) {
                break;
            }
        }
        
        return result;
    };
    
    
    
    this.showTwoBusRoute = function () {
        
    };
    
    
    
    //------------------------------------------------------------------
    // Get Position of 1 Place
    //
    this.getCoordinates = function (place) {
        return {'latitude' : place.latitude, 'longitude' : place.longitude}
    }

});
