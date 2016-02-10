'use strict';

angular.module('app.likeHeart', ['app.config'])
    .directive('likeHeart', function() {
        return {
            restrict: 'AEC',
            scope: {
                likes: '@',
                scope: '@',
                path: '@'
            },
            templateUrl: 'components/likeHeart/likeHeart.html',

            controller: function($scope, $http, $routeParams, authFactory) {
                var data, tab;
                $scope.toggleME = false;
                //$scope.heartClass = 'fa-heart-o';

                $scope.$watch('likes', function(newval, oldval) {
                    data = JSON.parse(newval);
                    $scope.likes = data;
                    scan();

                });

                function scan() {
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

                function like(id) {
                    $http({
                        url: backend + "/product/" + tab + "/like",
                        method: 'POST',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'token': authFactory.getToken()
                        }
                    }).success(function (data, status, headers, config) {
                        $scope.likes.likes++;
                        $scope.likes.liked = true;
                        scan();

                    }).error(function (data, status, headers, config) {
                        $scope.error = true;
                    });
                    //
                }

                function unlike(id) {
                    $http({
                        url: backend + "/product/" + tab + "/unlike",
                        method: 'POST',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'token': authFactory.getToken(),
                        }
                    }).success(function (data, status, headers, config) {
                        $scope.likes.likes--;
                        $scope.likes.liked = false;
                        scan();
                    }).error(function (data, status, headers, config) {
                        $scope.error = true;
                    });

                }

                $scope.tap = function() {
                    tab = JSON.parse($scope.scope);
                    if (tab.id) {
                        tab = tab.id;
                    } else {
                        tab = tab.product_id;
                    }

                    if (data.liked) {
                        unlike(tab);
                    } else {
                        like(tab);
                    }
                }

                //$scope.hover = function(active) {
                //    if (!active) {
                //        if (data.liked) {
                //            $scope.heartClass = 'fa-heart-o liked';
                //            $scope.textClass = 'light';
                //        } else {
                //            $scope.heartClass = 'fa-heart-o unliked';
                //            $scope.textClass = 'dark';
                //        }
                //
                //    } else {
                //        $scope.heartClass = 'fa-heart liked';
                //        $scope.textClass = 'light';
                //
                //    }
                //};
            },
            link: function(scope, elem, attrs) {
                // Just for altering the DOM
            }
        };
    });