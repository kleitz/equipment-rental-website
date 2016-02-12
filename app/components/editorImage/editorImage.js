'use strict';

angular.module('app.editorImage', ['app.config'])
    .directive('editorImage', function () {
        return {
            restrict: 'AEC',
            scope: {
                width: '=',
                height: '=',
                image: '@',
                preview: '=',
                radius: '=',
                quality: '@',
                index: '@'
            },
            templateUrl: 'components/editorImage/editorImage.html',
            controller: function ($scope, $colorThief, $http, $routeParams, authFactory) {
                var rgb;
                $scope.tap = function () {
                    if ($scope.preview) {
                        $scope.tapped = !$scope.tapped;
                        var img = new Image();

                        img.onload = function () {
                            setTimeout(function () {
                                $scope.imageStyles['background-image'] = 'url(\"' + $scope.url + '\")';
                                $scope.$apply();
                            }, 1);
                        }

                        img.src = $scope.url;
                        if (img.complete) img.onload();

                    }
                }
                $scope.hoverstyleCross = {
                    'height': '20%',
                    'width': '100%',
                    'background': 'rgba(10, 10, 10, 0.6)',
                    'border-radius': $scope.radius + 'px',
                    'color': '#e85647',
                    'display': 'flex',
                    'justify-content': 'center',
                    'align-items': 'center'
                }
                $scope.hoverstyleOpen = {
                    'height': '80%',
                    'width': '100%',
                    'background': 'rgba(30, 30, 30, 0.4)',
                    'border-radius': $scope.radius + 'px',
                    'color': '#fff',
                    'display': 'flex',
                    'justify-content': 'center',
                    'align-items': 'center'
                }

                $scope.previewStyle = {
                    'height': '100%',
                    'width': '100%',
                    'position': 'fixed',
                    'top': 0,
                    'left': 0,
                    'background-color': 'rgba(0, 0, 0, 0.2)',
                    'background-size': 'cover',
                    'z-index': 100,
                    'padding': '-20%'
                }
                $scope.imageStyles = {
                    'height': '100%',
                    'width': '100%',
                    'background': 'url("") no-repeat center center',
                    'background-size': 'contain',
                }

                $scope.imageStyle = {
                    'height': $scope.height + 'px',
                    'width': $scope.width + 'px',
                    'background': 'url("") no-repeat center center',
                    'background-size': 'cover',
                    'border-radius': $scope.radius + 'px',
                };
                $scope.$watch(
                    "image",
                    function handleFooChange() {
                        //console.log($scope.height)

                        if ($scope.image !== '{{product}}' && $scope.image !== 'undefined' && $scope.image !== '') {

                            $scope.data = JSON.parse($scope.image);
                            //console.log($scope.data)


                            $scope.url = domain + $scope.data.size.large;
                            var url;
                            if ($scope.quality === 'small') {
                                url = domain + $scope.data.size.small;
                            } else if ($scope.quality === 'medium') {
                                url = domain + $scope.data.size.medium;
                            } else if ($scope.quality === 'large') {
                                url = domain + $scope.data.size.large;
                            } else {
                                url = domain + $scope.data.size.thumb;
                            }


                            // $scope.imageStyles.push('background-image': 'url(' + url + ')');
                            //console.log(url);
                            $scope.imageStyle['background-image'] = 'url(\"https://d13yacurqjgara.cloudfront.net/users/12755/screenshots/1037374/hex-loader2.gif\")';

                            var img = new Image();
                            img.crossOrigin = "Anonymous"
                            img.onload = function () {
                                setTimeout(function () {
                                    rgb = $colorThief.getColor(img);
                                    $scope.previewStyle['background-color'] =  'rgba(' + rgb + ', 0.9)',
                                        $scope.imageStyle['background-image'] = 'url(\"' + url + '\")';
                                    $scope.imageStyles['background-image'] = 'url(\"' + $scope.url + '\")';
                                    $scope.imageStyle.border = '3px solid rgb(' + rgb + ')';
                                    $scope.$apply();
                                }, 1);
                            };

                            img.src = url;
                            if (img.complete) img.onload();
                        }

                    }
                );

                $scope.remove = function() {
                    console.log("removing " + $scope.index)
                    $http({
                        //url: backend + '/product/' + $routeParams.id + '/tag/' + $scope.title + '/remove',
                        url: backend + '/product/' + $routeParams.id + '/image/' + $scope.data.title + '/delete',
                        method: 'DELETE',
                        headers: {
                            'Content-Type': undefined,
                            'token': authFactory.getToken(),
                        }
                    }).success(function (data, status, headers, config) {
                        //$scope.tagclass = "editorTagBase animated fadeOut";

                        $scope.$emit('refreshImageEditor', $scope.index);


                    }).error(function (data, status, headers, config) {
                        console.log('error');
                        $scope.error = true;
                    });

                }


                $scope.hovering = function () {
                    $scope.hover = !$scope.hover;
                };
            },

            link: function (scope, elem, attrs, http) {


            }
        };
    });
