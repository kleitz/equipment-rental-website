'use strict';

angular.module('app.items', ['ngRoute'])

    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/listing', {
                templateUrl: 'views/items/items.html',
                controller: 'itemsCtrl'
            });
        }
    ])
    .controller('itemsCtrl', ['$rootScope', '$scope', '$http', '$location', 'authFactory', '$colorThief',
        function ($rootScope, $scope, $http, $location, authFactory, $colorThief, $watch) {
            var sortByUrl = '/updated/newest';
            $scope.listingOptions = {
                enablePaging: false
        };
            $scope.busy = false;
            if (window.localStorage.getItem("product_count")) {
                $scope.count = parseInt(window.localStorage.getItem("product_count"));
            } else {
                window.localStorage.setItem("product_count", 10);
                $scope.count = 10;
            }

            if (window.localStorage.getItem('enablePaging')) {

                $scope.listingOptions.enablePaging = window.localStorage.getItem('enablePaging');

            } else {
                window.localStorage.setItem("enablePaging", false);
                $scope.listingOptions.enablePaging = false;
            }
            console.log($scope.listingOptions.enablePaging)

            $scope.goto = function (id) {
                $location.path('/listing/' + id);
            };

            $scope.filter = {
                days: 7,
                sortBy: 'updated: newest first'
            }


            $scope.start = 0;


            if ($rootScope.loggedIn) {
                //updateResults();
            } else {
                $scope.view = false;
            }

            //$scope.$watch("count", function (newValue) {
            //    window.localStorage.setItem("product_count", newValue);
            //    console.log(newValue)
            //
            //    setTimeout(function() {
            //        resetProducts();
            //        getFilteredResults(backend + '/products' + sortByUrl);
            //
            //    }, 1000)
            //});

            $scope.changeViewAmount = function (amount) {
                window.localStorage.setItem("product_count", amount);
                console.log(amount)

                resetProducts();
                $scope.busy = true;
                $scope.start = $scope.start + $scope.count;
                getFilteredResults(backend + '/products' + sortByUrl);

            }

            $scope.changePaging = function (option) {
                //if (option) {
                //    $scope.listingOptions.enablePaging = !$scope.listingOptions.enablePaging
                //} else {
                //    if ($scope.listingOptions.enablePaging) {
                //        $scope.listingOptions.enablePaging = false;
                //    } else {
                //        $scope.listingOptions.enablePaging = true;
                //    }
                //}
                //console.log($scope.listingOptions.enablePaging)
                //window.localStorage.setItem("enablePaging", $scope.listingOptions.enablePaging);
            }

            $scope.back = function () {
                //$scope.start + $scope.count > $scope.products.total

                if ($scope.start <= 0) {
                    $scope.viewResults = false;
                } else {
                    $scope.viewResults = true;
                    $scope.start = $scope.start - $scope.count;
                    getFilteredResults(backend + '/products' + sortByUrl);
                }
            };

            $scope.forward = function () {
                if ($scope.start >= $scope.products.total - $scope.count) {
                    $scope.viewResults = false;
                } else {
                    $scope.viewResults = true;
                    $scope.start = $scope.start + $scope.count;
                    getFilteredResults(backend + '/products' + sortByUrl);
                }
            };

            var page = 0;

            $scope.pagingUpdate = function () {
                if (!$scope.enablePaging) {
                    if ($scope.busy) return;
                    if (!$scope.products) return;
                    $scope.busy = true;
                    $scope.start = $scope.start + $scope.count;
                    getFilteredResults(backend + '/products' + sortByUrl);
                }

            }

            $scope.getFilteredResults = function () {
                resetProducts();
                $scope.start = $scope.start + $scope.count;
                switch ($scope.filter.sortBy) {
                    case 'added: newest first':
                        sortByUrl = '/added/newest';
                        break;
                    case 'added: oldest first':
                        sortByUrl = '/added/oldest';
                        break;
                    case 'updated: newest first':
                        sortByUrl = '/updated/newest';
                        break;
                    case 'updated: oldest first':
                        sortByUrl = '/updated/oldest';
                        break;
                    case 'Likes: Most likes':
                        sortByUrl = '/likes/most';
                        break;
                    case 'Likes: Least likes':
                        sortByUrl = '/likes/least';
                        break;
                    case 'Duration: Highest first':
                        sortByUrl = '/duration/highest';
                        break;
                    case 'Duration: Lowest first':
                        sortByUrl = '/duration/lowest';
                        break;
                    default:
                        sortByUrl = '/updated/newest';
                        break;
                }
                getFilteredResults(backend + '/products' + sortByUrl);
            }

            function getFilteredResults(url) {

                if (!$scope.noMoreData) {
                    $http({
                        url: url,
                        method: 'GET',
                        headers: {
                            'Start': $scope.start,
                            'Count': $scope.count,
                            'token': authFactory.getToken(),
                        }
                    }).success(function (data, status, headers, config) {
                        //$scope.products = data;
                        console.log(data)
                        $scope.products.total += data.total;
                        for (var i = 0; i < data.total; i++) {
                            $scope.products.items.push(data.items[i])
                        }
                        var urls = [];
                        $scope.busy = false;
                        if (data.total === 0) {
                            $scope.noMoreData = true;
                        }

                    }).error(function (data, status, headers, config) {
                        console.log(data);
                        $scope.error = true;
                    });
                }

            }


            function resetProducts() {
                page = 0;
                $scope.noMoreData = false;
                $scope.start = -$scope.count;
                $scope.products = {
                    items: [],
                    total: 0
                };
            }

            resetProducts();


            function updateResults() {
                $scope.busy = true;
                $http({
                    url: backend + "/products",
                    method: 'GET',
                    headers: {
                        'Start': $scope.start,
                        'Count': $scope.count,
                        'token': authFactory.getToken(),
                    }
                }).success(function (data, status, headers, config) {
                    $scope.products.total += data.total;
                    for (var i = 0; i < data.total; i++) {
                        $scope.products.items.push(data.items[i])
                    }

                    $scope.busy = false;
                    var urls = [];

                }).error(function (data, status, headers, config) {
                    $scope.error = true;
                });
            }

            $scope.deleteItem = function () {
                $http({
                    url: backend + '/product/' + $routeParams.id + '/delete',
                    method: 'DELETE',
                    headers: {
                        'token': authFactory.getToken()
                    },
                }).success(function (data, status, headers, config) {
                    $location.path('/owner/listing');
                }).error(function (data, status, headers, config) {
                    $scope.error = true;
                });
            };

            $scope.search = function (term) {
                if (term.length > 4) {
                    resetProducts();
                    $scope.start = $scope.start + $scope.count;
                    getResults(term);
                } else {
                    //updateResults();
                    getFilteredResults(backend + '/products' + sortByUrl);
                }
            };

            function getResults(term) {
                $http({
                    url: backend + "/search/" + term,
                    method: 'GET',
                    headers: {
                        'Start': $scope.start,
                        'Count': $scope.count
                    }
                }).success(function (data, status, headers, config) {
                    //$scope.products = data;
                    console.log(data)
                    $scope.products.total += data.total;
                    for (var i = 0; i < data.total; i++) {
                        $scope.products.items.push(data.items[i])
                    }
                    $scope.showResults = true;
                }).error(function (data, status, headers, config) {
                    $scope.error = true;
                    $scope.showResults = false;
                });
            }


        }]);
