'use strict';

angular.module('app.myrequests', ['ngRoute', 'app.config'])

    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/my/requests', {
                templateUrl: 'views/myrequests/myrequests.html',
                controller: 'myrequestsCtrl'
            });
        }
    ])
    .controller('myrequestsCtrl', ['$rootScope', '$scope', '$http', '$routeParams', '$location', 'Configuration', 'authFactory', function ($rootScope, $scope, $http, $routeParams, $location, Configuration, authFactory) {
        $scope.noRequests = false;
        getRequests();


        $scope.cancel = function(id, index) {
            $http({
                url: backend + '/product/' + id + '/request/cancel',
                method: 'POST',
                headers: {
                    'token': authFactory.getToken()
                },
            }).success(function (data, status, headers, config) {
                $scope.requests.splice(index, 1);
                $scope.hasRequest = false;
            }).error(function (data, status, headers, config) {
                $scope.error = true;
            });
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
                console.log(data)
                if (data.total === 0) {
                    $scope.noRequests = true;
                }
                $scope.requests = data.requests;
            }).error(function (data, status, headers, config) {
                $scope.error = true;
            });
        }
    }]);
