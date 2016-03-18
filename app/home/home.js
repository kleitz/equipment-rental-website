'use strict';

angular.module('app.home', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/home/', {
            templateUrl: 'home/home.html',
            controller: 'HomeCtrl'
        });
        $routeProvider.when('/', {
            templateUrl: 'home/home.html',
            controller: 'HomeCtrl'
        });
    }])

    .controller('HomeCtrl', ['$rootScope', '$scope', '$http', 'authFactory', 'Title', 'History', function ($rootScope, $scope, $http, authFactory, Title, History) {
        $scope.historyListing = History.getProducts();
        $scope.removeHistoryItem = function(pop, index) {
            console.log(pop)
            History.removeProduct(pop)
            $scope.historyListing.splice(index, 1);
        };
        $scope.$watch('site', function () {
            if ($rootScope.site) {
                Title.setTitle($rootScope.site.title + ': Home');
            }
        });
        $scope.domain = domain;

        $scope.getPopStyle = function (pop) {
            //console.log(pop)
            var definedurl = domain + pop.images[0].size.medium
            return {
                'background': 'url(' + definedurl + ') no-repeat center center',
                'background-size': 'cover',
                'overflow': 'hidden'
            }
        }

        if ($rootScope.loggedIn) {
            $scope.view = true;
            $scope.showHello = false;
            sayHello();

            $scope.showTimeline = false;
            getTimeline();
            //getNewestProducts();
            //getRecentlyUpdatedProducts();
            getPopularTags();
            getMostLiked();
        } else {
            $scope.view = false;
        }

        function getTimeline() {
            $http({
                url: backend + "/p/rent/current",
                method: 'GET',
                headers: {
                    'Count': 5,
                    'token': authFactory.getToken()
                }
            }).success(function (data, status, headers, config) {
                $scope.timeline = data;
                $scope.showTimeline = true;

            }).error(function (data, status, headers, config) {
                $scope.error = true;
            });
        }


        function getMostLiked() {
            $http({
                url: backend + "/products/likes/most",
                method: 'GET',
                headers: {
                    'Count': 5,
                    'token': authFactory.getToken()
                }
            }).success(function (data, status, headers, config) {
                $scope.popularitems = data.items;
                console.log(data)
            }).error(function (data, status, headers, config) {
                $scope.error = true;
            });
        }

        function getNewestProducts() {
            $http({
                url: backend + "/products/added/newest",
                method: 'GET',
                headers: {
                    'Count': 5,
                    'token': authFactory.getToken()
                }
            }).success(function (data, status, headers, config) {
                $scope.added = data;
                $scope.showTimeline = true;

            }).error(function (data, status, headers, config) {
                $scope.error = true;
            });
        }

        function getRecentlyUpdatedProducts() {
            $http({
                url: backend + "/products/updated/newest",
                method: 'GET',
                headers: {
                    'Count': 5,
                    'token': authFactory.getToken()
                }
            }).success(function (data, status, headers, config) {
                $scope.updated = data;
                //console.log(data)
                $scope.showTimeline = true;

            }).error(function (data, status, headers, config) {
                $scope.error = true;
            });
        }

        $scope.getTagClass = function (tag) {
            return {
                'background': tag.colour,
                'color': 'white'
                //'font-size': '1rem'
            }
        }

        function getPopularTags() {
            $http({
                url: backend + "/filter/tags/popular",
                method: 'GET',
                headers: {
                    'Start': 0,
                    'Count': 10,
                    'token': authFactory.getToken()
                }
            }).success(function (data, status, headers, config) {
                $scope.populartags = [];
                for (var i = 0; i < data.length; i++) {
                    var colour = Please.make_color();
                    //console.log(colour)
                    $scope.populartags.push({
                        "title": data[i].title,
                        "amount": data[i].amount,
                        "colour": colour[0]
                    });
                }

                //console.log(data)
            }).error(function (data, status, headers, config) {
                $scope.error = true;
            });
        }

        function sayHello() {
            $http({
                url: backend + "/hello",
                method: 'GET',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'token': authFactory.getToken()
                }
            }).success(function (data, status, headers, config) {
                $scope.message = data.message;
                $scope.showHello = true;
            }).error(function (data, status, headers, config) {

            });
        }
    }]);
