'use strict';

angular.module('app.likeHeart', ['app.config'])
    .directive('likeHeart', function () {
        return {
            restrict: 'AEC',
            scope: {
                likes: '@',
                scope: '@',
                path: '@'
            },
            templateUrl: 'components/likeHeart/likeHeart.html',
            controller: function ($scope, $attrs, $http, $routeParams, authFactory) {

                function isObject(object) {
                    return object === {}.constructor;
                }

                var data, tab;
                $scope.toggleME = false;

                $scope.$watch('likes', function (newval) {

                    // Check if input is a json (starts of as a string and then becomes a json?????)
                    if (isObject(newval.constructor)) {
                        // If it is a json, just set the value
                        data = newval;
                    } else {
                        // If not then we have to parse it from the string
                        data = JSON.parse(newval);
                    }


                    $scope.likes = data;
                    scan();

                });

                $scope.tap = function () {
                    tab = JSON.parse($scope.scope);
                    if (tab.id) {
                        tab = tab.id;
                    } else {
                        tab = tab.product_id;
                    }

                    if (data.liked) {
                        unlike();
                    } else {
                        like();
                    }

                };


                function scan() {
                    if (data) {


                        if (data.liked) {
                            $scope.heartClass = 'fa-heart liked';
                        } else {
                            $scope.heartClass = 'fa-heart-o unliked';
                        }

                        $scope.number = data.likes;
                        if (data.likes == 1) {
                            $scope.value = ' like';
                        } else {
                            $scope.value = ' likes';
                        }
                    }
                }

                function like() {
                    $http({
                        url: backend + "/product/" + tab + "/like",
                        method: 'POST',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'token': authFactory.getToken()
                        }
                    }).success(function () {
                        $scope.likes.likes++;
                        $scope.likes.liked = true;
                        scan();

                    }).error(function () {
                        $scope.error = true;
                    });
                    //
                }

                function unlike() {
                    $http({
                        url: backend + "/product/" + tab + "/unlike",
                        method: 'POST',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'token': authFactory.getToken()
                        }
                    }).success(function () {
                        $scope.likes.likes--;
                        $scope.likes.liked = false;
                        scan();
                    }).error(function () {
                        $scope.error = true;
                    });

                }

            },
            link: function (scope, elem, attrs) {
                // Just for altering the DOM
            }
        };
    });