'use strict';

angular.module('app.logout', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/logout', {
            templateUrl: 'views/logout/logout.html',
            controller: 'LogoutCtrl'
        });
    }])

    .controller('LogoutCtrl', ['$scope', '$rootScope', 'authFactory', 'Title', function($scope, $rootScope, authFactory, Title) {
        $scope.view = $rootScope.loggedIn;

        $scope.$watch('site', function() {
            if ($rootScope.site) {
                Title.setTitle($rootScope.site.title + ': Logged out');
            }
        });

        if ($rootScope.loggedIn) {
            // window.sessionStorage.remov0eItem("token");
            authFactory.killAuth();
            $rootScope.loggedIn = false;
        }
    }]);
