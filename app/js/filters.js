'use strict';

/* Filters */

angular.module('BuytSaigonFilters', []).filter('busRouteFilter', function () {
    return function (string) {
        if (string.indexOf('Leave') > -1) {
            return string.replace('Leave', ' (Lượt Đi)');
        } else if (string.indexOf('Return') > -1) {
            return string.replace('Return', ' (Lượt Về)');
        } else {
            return string;
        }
    };
});