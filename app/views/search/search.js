'use strict';

angular.module('app.search', ['ngRoute'])

    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/search', {
                templateUrl: 'views/search/search.html',
                controller: 'searchCtrl'
            });
        }
    ])
    .controller('searchCtrl', ['$rootScope', '$scope', '$http', '$location', '$routeParams', function ($rootScope, $scope, $http, $location, $routeParams, $watch) {
        $scope.count = 0;
        if (window.localStorage.getItem("product_count")) {
            $scope.count = parseInt(window.localStorage.getItem("product_count"));
        } else {
            window.localStorage.setItem("product_count", 10);
            $scope.count = 10;
        }

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

        $scope.start = 0;

        $scope.search = function(term) {
            if (term.length > 4) {
                getResults(term);
            }
        };

        function getResults(term) {
            $http({
                url: backend + "/search/" + term,
                method: 'GET',
                headers: {
                    'Start':$scope.start,
                    'Count':$scope.count
                }
            }).success(function(data, status, headers, config) {
                console.log(data)
                $scope.products = data;
                $scope.showResults = true;
            }).
            error(function(data, status, headers, config) {
                $scope.error = true;
                $scope.showResults = false;
            });
        }

    }]);
