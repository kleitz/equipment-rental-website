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
    .controller('myrequestsCtrl', ['$rootScope', '$scope', '$http', '$routeParams', '$location', 'Configuration', 'authFactory', 'Notification', 'Title',
        function ($rootScope, $scope, $http, $routeParams, $location, Configuration, authFactory, Notification, Title) {
            $scope.noRequests = false;
            getRequests();

            $scope.$watch('site', function () {
                if ($rootScope.site) {
                    Title.setTitle($rootScope.site.title + ': My Requests');
                }
            });
            $scope.cancel = function (id, index) {
                var title = $scope.requests[index].title
                Notification.info({message: 'Canceling ' + title, positionY: 'bottom', positionX: 'center'});
                $http({
                    url: backend + '/product/' + id + '/request/cancel',
                    method: 'POST',
                    headers: {
                        'token': authFactory.getToken()
                    },
                }).success(function (data, status, headers, config) {
                    $scope.requests.splice(index, 1);
                    $scope.hasRequest = false;
                    Notification.success({
                        message: 'You have canceled ' + title,
                        positionY: 'bottom',
                        positionX: 'center'
                    });
                }).error(function (data, status, headers, config) {
                    $scope.error = true;
                    Notification.error({message: 'something went wrong', positionY: 'bottom', positionX: 'center'});
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
