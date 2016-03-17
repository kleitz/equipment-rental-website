'use strict';

angular.module('app.discoveryItems', ['app.config'])
    .directive('discoveryItems', function () {
        return {
            restrict: 'AEC',
            scope: {
                images: '@',
                endpoint: '@',
                numbertoshow: '=',
                type: '@',
                showpreview: '@'
            },
            templateUrl: 'components/discoveryItems/discoveryItems.html',
            controller: function ($scope, $http, authFactory, $timeout, $rootScope) {
                var images;
                getResults();
                $scope.ready = [];
                $scope.domain = domain;

                $scope.$on("$destroy", function () {
                    $rootScope.bodyStyle.background = 'url() no-repeat center center';

                });

                $scope.getClass = function (product, index) {
                    var url = domain + product.images[0].size.medium;


                    var img = new Image();
                    img.onload = function () {
                        console.log('image loaded: ' + url);
                        //debugger
                        $scope.ready[index] = true;
                        $scope.$apply();
                        //$scope.showcaseImage = {
                        //    'background': 'url(' + domain + images[index].size.large + ') no-repeat center center',
                        //    'background-size': 'contain'
                        //};
                        //$scope.images[index].cached = true;
                        //$scope.imagePreviewClass = 'new';
                        //$scope.$apply();
                        //$scope.DropZoneStyle.background = 'url(' + uri + ') no-repeat center center fixed'

                    };
                    setTimeout(function () {
                        if (!$scope.ready[index]) {

                            img.src = url;
                        }
                    }, 300);

                    return {
                        'background': 'url(' + url + ') no-repeat center center',
                        'background-size': 'cover'
                    };


                };

                var count = 0;
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

                $scope.getCardClass = function (index) {
                    if (index === 0) {
                        return 'main';
                    } else {
                        return 'sub';
                    }
                }

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
                    }).success(function (data, status, headers, config) {
                        $scope.products = {};
                        $timeout(function () {
                            $scope.products = data;
                            if (data.total < $scope.numbertoshow) {
                                $scope.nomoreright = true;
                            }
                            $scope.$apply();
                        }, 1);
                        console.log(data)
                        for (var i = 0; i < data.total; i++) {
                            $scope.ready.push(false)
                            if (i === 0) {
                                $rootScope.bodyStyle.background = 'url(' + domain + data.items[0].images[0].size.large + ') no-repeat center center';
                            }
                        }
                    }).error(function (data, status, headers, config) {
                        $scope.error = true;
                    });
                }

            },

            link: function (scope, elem, attrs, http) {


            }
        };
    });
