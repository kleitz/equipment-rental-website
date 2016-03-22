'use strict';

angular.module('app.admin.users', ['ngRoute'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/admin/users', {
                templateUrl: 'views/admin/users/users.html',
                controller: 'adminUsersCtrl'
            });
        }
    ])
    .controller('adminUsersCtrl', ['$rootScope', '$scope', '$http', 'authFactory', '$window', function($rootScope, $scope, $http, authFactory, $window) {
        if ($rootScope.auth.role !== 'admin') {
            $window.location.href = '#/';
        } else {
            if ($rootScope.loggedIn) {
                getUsers();
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

        $scope.changeRole = function(index, username, role) {
            changeRole(index, username, role);
        }

        function changeRole(index, username, role) {
            $http({
                url: backend + '/user/' + username + '/role/' + role,
                method: 'POST',
                headers: {
                    'token': authFactory.getToken(),
                    'Start':$scope.start,
                    'Count':$scope.count
                }
            }).success(function(data, status, headers, config) {
                $scope.users[index].role = role;
                $scope.openRoleChangger = false;

            }).
            error(function(data, status, headers, config) {
                $scope.error = true;
            });

        }

        $scope.deleteUser = function(index, username) {
            $http({
                url: backend + '/user/' + username,
                method: 'DELETE',
                headers: {
                    'token': authFactory.getToken()
                }
            }).success(function(data, status, headers, config) {
                //$scope.users[index].role = role;
                //$scope.openRoleChangger = false;
                getUsers();
            }).
            error(function(data, status, headers, config) {
                $scope.error = true;
            });
        }


        function getUsers() {
            $http({
                url: backend + "/users",
                method: 'GET',
                headers: {
                    'token': authFactory.getToken(),
                    'Start':$scope.start,
                    'Count':$scope.count
                }
            }).success(function(data, status, headers, config) {
                $scope.users = data;

            }).
            error(function(data, status, headers, config) {
                $scope.error = true;
            });
        }



    }]);
