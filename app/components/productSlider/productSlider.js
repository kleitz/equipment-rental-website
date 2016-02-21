'use strict';

angular.module('app.productSlider', ['app.config'])
    .directive('productSlider', function () {
        return {
            restrict: 'AEC',
            scope: {
                images: '@',
                endpoint: '@',
                numbertoshow: '=',
                type: '@'
            },
            templateUrl: 'components/productSlider/productSlider.html',
            controller: function ($scope, $http, authFactory, $timeout) {
                var images;
                $scope.step = 0;
                $scope.displayLargeScreen = false;
                $scope.isHovering = [{'active': false}, {'active': false}, {'active': false}];

                $scope.step = 0;
                getResults();
                $scope.domain = domain;

                $scope.getPrevious = function() {
                    $scope.step = $scope.step - parseInt($scope.numbertoshow);
                    getResults();
                    $scope.nomoreright = false;
                };

                $scope.getNext = function() {
                    if ($scope.products.total == parseInt($scope.numbertoshow)) {

                        $scope.step = $scope.step + parseInt($scope.numbertoshow);
                        getResults();
                    } else {
                        $scope.nomoreright = true;
                    }
                };

                $scope.getClass = function(product) {
                    var url = domain + product.images[0].size.medium;
                    return {
                        'background':'url(' + url + ') no-repeat center center',
                        'background-size': 'cover',
                        'overflow':'hidden'
                    };

                };

                function getResults() {
                    $http({
                        url: backend + $scope.endpoint,
                        method: 'GET',
                        headers: {
                            'Start': $scope.step,
                            'Step': $scope.step,
                            'Count': $scope.numbertoshow,
                            'token': authFactory.getToken()
                        }
                    }).success(function(data, status, headers, config) {
                        $scope.products = {};
                        $timeout(function() {
                            $scope.products = data;
                            if (data.total < $scope.numbertoshow) {
                                $scope.nomoreright = true;
                            }
                            $scope.$apply();
                        }, 1);
                    }).
                    error(function(data, status, headers, config) {
                        $scope.error = true;
                    });
                }

            },

            link: function (scope, elem, attrs, http) {


            }
        };
    });
