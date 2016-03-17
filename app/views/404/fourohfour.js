'use strict';

angular.module('app.fourohfour', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/fourOhFour', {
            templateUrl: 'views/404/fourohfour.html',
            controller: 'fourOhFourCtrl'
        });
    }])

    .controller('fourOhFourCtrl', ['$scope', '$rootScope', 'Title', function($scope, $rootScope, Title) {
        $scope.$watch('site', function() {
            if ($rootScope.site) {
                Title.setTitle($rootScope.site.title + ': 404 Page does not exist');
            }
        });

        console.log("wrong route");
    }]);
