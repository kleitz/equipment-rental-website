'use strict';

angular.module('app.requestProducts', ['ngRoute', 'app.config'])

    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/requests', {
                templateUrl: 'views/requests/products/products.html',
                controller: 'requestProductsCtrl'
            });
        }
    ])
    .controller('requestProductsCtrl', ['$rootScope', '$scope', '$http', '$routeParams', '$location', 'Configuration', 'authFactory', function ($rootScope, $scope, $http, $routeParams, $location, Configuration, authFactory) {
        $scope.noRequests = false;
        getRequests();


        $scope.cancel = function(username) {
            console.log(username);
        };

        function getRequests() {
            $http({
                url: backend + "/requests",
                method: 'GET',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'token': authFactory.getToken(),
                    'start': 0,
                    'count': 10
                }
            }).success(function (data, status, headers, config) {
                console.log(data.items)
                if (data.total === 0) {
                    $scope.noRequests = true;
                }
                $scope.requests = data.items;
            }).error(function (data, status, headers, config) {
                $scope.error = true;
            });
        }
    }]);
