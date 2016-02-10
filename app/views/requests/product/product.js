'use strict';

angular.module('app.requestProduct', ['ngRoute', 'app.config'])

    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/listing/:id/requests', {
                templateUrl: 'views/requests/product/product.html',
                controller: 'requestProductCtrl'
            });
        }
    ])
    .controller('requestProductCtrl', ['$rootScope', '$scope', '$http', '$routeParams', '$location', 'Configuration', 'authFactory', function ($rootScope, $scope, $http, $routeParams, $location, Configuration, authFactory) {
        $scope.noRequests = false;
        getRequests();

        $scope.deny = function(username) {
            $http({
                url: backend + '/product/' + $routeParams.id + '/request/cancel',
                method: 'POST',
                headers: {
                    'token': authFactory.getToken(),
                    'username': username
                },
            }).success(function (data, status, headers, config) {
                getRequests();
                $scope.hasRequest = false;
            }).error(function (data, status, headers, config) {
                $scope.error = true;
            });
        }

        $scope.accept = function (username) {
            //console.log(username);
            $http({
                url: backend + "/product/" + $routeParams.id + "/request/authorize/" + username,
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'token': authFactory.getToken()
                }
            }).success(function (data, status, headers, config) {
                getRequests();
            }).error(function (data, status, headers, config) {
                $scope.error = true;
            });
        };

        $scope.cancel = function(username) {
            //console.log(username);
        };

        function getRequests() {
            $http({
                url: backend + "/requests/" + $routeParams.id,
                method: 'GET',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'token': authFactory.getToken()
                }
            }).success(function (data, status, headers, config) {
                if (data.total === 0) {
                    $scope.noRequests = true;
                }
                $scope.requests = data.requests;
            }).error(function (data, status, headers, config) {
                $scope.error = true;
            });
        }
    }]);
