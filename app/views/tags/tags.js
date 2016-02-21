'use strict';

angular.module('app.tags', ['ngRoute'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/tags/:tag', {
                templateUrl: 'views/tags/tags.html',
                controller: 'tagsCtrl'
            });
        }
    ])
    .controller('tagsCtrl', ['$rootScope', '$scope', '$http', '$location', '$routeParams', function($rootScope, $scope, $http, $location, $routeParams, $watch) {
        $scope.currentTag = $routeParams.tag
        if (window.localStorage.getItem("product_count")) {
            $scope.count = parseInt(window.localStorage.getItem("product_count"));
        } else {
            window.localStorage.setItem("product_count", 10);
            $scope.count = 10;
        }

        $scope.goto = function(id) {
            $location.path('/listing/' + id);
        };


        $scope.start = 0;



        if ($rootScope.loggedIn) {
            //updateResults();
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
        };

        $scope.forward = function() {
            if ($scope.start >= $scope.products.total - $scope.count) {
                $scope.viewResults = false;
            } else {
                $scope.viewResults = true;
                $scope.start = $scope.start + $scope.count;
                updateResults();
            }
        };

        function updateResults() {
            var url = backend + "/tags/";
            $http({
                url: url + $routeParams.tag,
                method: 'GET',
                headers: {
                    'Start':$scope.start,
                    'Count':$scope.count
                }
            }).success(function(data, status, headers, config) {
                $scope.products = data;
            }).
            error(function(data, status, headers, config) {
                $scope.error = true;
            });
        }


    }]);
