'use strict';

angular.module('app.myItems', ['ngRoute'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/my/items/current', {
                templateUrl: 'views/myItems/myItems.html',
                controller: 'myItemsCtrl'
            });
        }
    ])
    .controller('myItemsCtrl', ['$rootScope', '$scope', '$http', 'authFactory', 'Title', function($rootScope, $scope, $http, authFactory, Title, $watch) {
        if (window.localStorage.getItem("product_count")) {
            $scope.count = parseInt(window.localStorage.getItem("product_count"));
        } else {
            window.localStorage.setItem("product_count", 2);
            $scope.count = 2;
        }

        $scope.$watch('site', function() {
            if ($rootScope.site) {
                Title.setTitle($rootScope.site.title + ': My Items');
            }
        });


        $scope.start = 0;



        if ($rootScope.loggedIn) {
            updateResults();
        } else {
            $scope.view = false;
        }

        $scope.$watch("count", function(newValue) {
            window.localStorage.setItem("product_count", newValue);
            updateResults();
        });

        $scope.back = function() {
            //$scope.start + $scope.count > $scope.products.total

            if ($scope.start <= 0) {
                $scope.viewResults = false;
            } else {
                $scope.viewResults = true;
                $scope.start = $scope.start - $scope.count;
                updateResults();
            }
        }

        $scope.forward = function() {
            if ($scope.start >= $scope.products.total - $scope.count) {
                $scope.viewResults = false;
            } else {
                $scope.viewResults = true;
                $scope.start = $scope.start + $scope.count;
                updateResults();
            }
        }

        function updateResults() {
            $http({
                url: backend + "/p/rent/current",
                method: 'GET',
                headers: {
                    'Start':$scope.start,
                    'Count':$scope.count,
                    'token': authFactory.getToken()
                }
            }).success(function(data, status, headers, config) {
                $scope.products = data;
                console.log(data);
            }).
            error(function(data, status, headers, config) {
                $scope.error = true;
            });
        }


    }]);
