'use strict';

angular.module('app.owner.comments', ['ngRoute'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/owner/comments/:pid', {
                templateUrl: 'views/owner/comments/comments.html',
                controller: 'ownerCommentsCtrl'
            });
        }
    ])
    .controller('ownerCommentsCtrl', ['$rootScope', '$scope', '$http', 'authFactory', '$location', '$routeParams', function($rootScope, $scope, $http, authFactory, $location, $routeParams, $watch) {
        if (window.localStorage.getItem("product_count")) {
            $scope.count = parseInt(window.localStorage.getItem("product_count"));
        } else {
            window.localStorage.setItem("product_count", 2);
            $scope.count = 2;
        }


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
                url: backend + "/product/" + $routeParams.pid,
                method: 'GET',
                headers: {
                    'token': authFactory.getToken(),
                    'Start':$scope.start,
                    'Count':$scope.count
                }
            }).success(function(data, status, headers, config) {
                $scope.product = data.items[0];
                $scope.comments = data.items[0].comments;
                console.log(data.items);
            }).
            error(function(data, status, headers, config) {
                $scope.error = true;
            });
        }


    }]);
