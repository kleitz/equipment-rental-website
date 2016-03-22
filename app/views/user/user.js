'use strict';

angular.module('app.user', ['ngRoute'])

    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/user/:user', {
                templateUrl: 'views/user/user.html',
                controller: 'UserCtrl'
            });
        }
    ])
    .controller('UserCtrl', ['$routeParams', '$scope', '$http', 'Title', '$rootScope', function ($routeParams, $scope, $http, Title, $rootScope) {
        $scope.$watch('site', function () {
            if ($rootScope.site) {
                Title.setTitle($rootScope.site.title + ': Profile');
            }
        });
        $scope.view = true;
        $scope.query = $routeParams.user;
        $http({
            url: backend + "/user/" + $routeParams.user,
            method: 'GET'
        }).success(function (data, status, headers, config) {
            //console.log(data);
            $scope.user = data;

            Title.setTitle($rootScope.site.title + ': data.username');

            $http({
                url: backend + "/identify/qr/user",
                method: 'GET',
                headers: {
                    'token': window.sessionStorage.token,
                    'width': 300,
                    'height': 300,
                    'code': data.username
                }
            }).success(function (data, status, headers, config) {

                $scope.qr = data;
            }).error(function (data, status, headers, config) {
                $scope.error = true;
            });
        }).error(function (data, status, headers, config) {
            console.log(data);
        });


        $http({
            url: backend + "/products/" + $routeParams.user,
            method: 'GET',
        }).success(function (data, status, headers, config) {
            $scope.products = data;
        }).error(function (data, status, headers, config) {
            $scope.error = true;
        });

    }]);
