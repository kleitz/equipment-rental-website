'use strict';

angular.module('app.productSlider', ['app.config'])
    .directive('productSlider', function () {
        return {
            restrict: 'AEC',
            scope: {
                images: '@',
                endpoint: '@',
                numbertoshow: '=',
                type: '@',
                showpreview: '@'
            },
            templateUrl: 'components/productSlider/productSlider.html',
            controller: function ($scope, $http, authFactory, $timeout) {
                
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

                
                //setInterval(function() {
                //    if (count > 3) {
                //        count = 0;
                //    } else {
                //        count++;
                //    }
                //    console.log($scope.products.items[count].images[0].size.large)
                //    $scope.PreviewStyles.background = 'url(' + domain + $scope.products.items[count].images[0].size.large + ') no-repeat center center';
                //    $scope.$apply();
                //}, 1000);


                $scope.PreviewStyles = {
                    background: 'url() no-repeat center center',
                    '-webkit-background-size': 'cover',
                    '-moz-background-size': 'cover',
                    '-o-background-size': 'cover',
                    'background-size': 'cover'
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
                    }).success(function(data) {
                        $scope.products = {};
                        $timeout(function() {
                            $scope.products = data;
                            if (data.total < $scope.numbertoshow) {
                                $scope.nomoreright = true;
                            }
                            $scope.$apply();
                        }, 1);
                    }).
                    error(function() {
                        $scope.error = true;
                    });
                }

            },

            link: function (scope, elem, attrs, http) {


            }
        };
    });
