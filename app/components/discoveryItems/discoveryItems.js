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
                getResults();
                $scope.ready = [];
                $scope.domain = domain;

                // On page destroy
                $scope.$on("$destroy", function () {
                    // Remove any instance of background being set
                    $rootScope.bodyStyle.background = 'url() no-repeat center center';
                });

                $scope.getClass = function (product, index) {
                    var url = domain + product.images[0].size.medium;

                    var img = new Image();
                    img.onload = function () {
                        $scope.ready[index] = true;
                        $scope.$apply();
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
                    }).success(function (data) {
                        $scope.products = {};
                        $timeout(function () {
                            $scope.products = data;
                            if (data.total < $scope.numbertoshow) {
                                $scope.nomoreright = true;
                            }
                            $scope.$apply();
                        }, 1);

                        for (var i = 0; i < data.total; i++) {
                            $scope.ready.push(false);
                        }
                    }).error(function (data) {
                        console.error(data);
                        $scope.error = true;
                    });
                }
            }
        };
    });
