'use strict';

angular.module('app.fourohfour', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/fourOhFour', {
            templateUrl: 'views/404/fourohfour.html',
            controller: 'fourOhFourCtrl'
        });
    }])

    .controller('fourOhFourCtrl', ['$scope', '$rootScope', 'authFactory', function($scope, $rootScope, authFactory) {
        console.log("wrong route");
    }]);
