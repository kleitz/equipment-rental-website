'use strict';

angular.module('app.admin', ['ngRoute'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/admin/', {
                templateUrl: 'views/admin/admin.html',
                controller: 'adminCtrl'
            });
        }
    ])
    .controller('adminCtrl', ['$rootScope', '$scope', '$http', 'authFactory', '$window', function($rootScope, $scope, $http, authFactory, $window) {
        if ($rootScope.auth.role !== 'admin') {
            $window.location.href = '#/';
        } else {
            if ($rootScope.loggedIn) {
                angular.element(document.getElementsByClassName('wrapper')).addClass('admin');
                //angular.element(document.getElementsByClassName('body')).addClass('admin');
                //angular.element(document.getElementsByClassName('html')).css('background': '#2c3e50');
                angular.element(document.getElementsByClassName('navbar')).addClass('admin');
                //debugger
            } else {
                $scope.view = false;
            }

            $scope.$on('$locationChangeStart', function( event ) {
                angular.element(document.getElementsByClassName('wrapper')).removeClass('admin');
                //angular.element(document.getElementsByClassName('body')).removeClass('admin');
                //angular.element(document.getElementsByClassName('html')).removeClass('admin');
                angular.element(document.getElementsByClassName('navbar')).removeClass('admin');
            });
        }



    }]);
