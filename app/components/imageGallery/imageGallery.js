'use strict';

angular.module('app.imageGallery', ['app.config'])
    .directive('imageGallery', function () {
        return {
            restrict: 'AEC',
            scope: {
                images: '@',
            },
            templateUrl: 'components/imageGallery/imageGallery.html',
            controller: function ($scope, $timeout) {
                $scope.largeScreenClass = 'closed';
                var images;
                $scope.displayLargeScreen = false;
                $scope.isHovering = [{'active': false}, {'active': false}, {'active': false}];
                $scope.$watch('images', function (val) {
                    if (val) {
                        $scope.images = angular.fromJson(val);
                        images = angular.fromJson(val);
                        //console.log(images);
                        $scope.source = images;
                        $scope.domain = domain;
                        changeImage(0);
                    }
                    // do something
                });

                $scope.changeImage = function (index) {
                    changeImage(index);
                };

                var previousIndexPreview = 100;

                function changeImage(index) {
                    console.log(index)
                    //$scope.showImage = images[index].size.large;
                    //var ele = angular.element(document.querySelector('#thisshowcase'));
                    //ele.addClass('animated fadeOut');
                    //ele.addClass('animated  fadeIn')

                    setTimeout(function () {
                        console.log(index + ':' + previousIndexPreview)
                        if (index !== previousIndexPreview) {

                            $scope.imagePreviewClass = '';
                            $scope.$apply();
                        } else {

                        }
                        previousIndexPreview = index;

                    }, 0);
                    if (!$scope.images[index].cached) {
                        var img = new Image();
                        img.onload = function () {
                            console.log('image loaded')
                            $scope.showcaseImage = {
                                'background': 'url(' + domain + images[index].size.large + ') no-repeat center center',
                                'background-size': 'contain'
                            };
                            $scope.images[index].cached = true;
                            $scope.imagePreviewClass = 'new';
                            $scope.$apply();
                            //$scope.DropZoneStyle.background = 'url(' + uri + ') no-repeat center center fixed'
                        };
                        setTimeout(function () {
                            img.src = domain + $scope.images[index].size.large;
                        }, 0);


                    } else {
                        setTimeout(function () {
                            $scope.showcaseImage = {
                                'background': 'url(' + domain + images[index].size.large + ') no-repeat center center',
                                'background-size': 'contain'
                            };
                            $scope.imagePreviewClass = 'new';
                            $scope.$apply();
                        }, 0);

                    }
                }


                function changeHoverState(hover, index) {
                    $scope.isHovering[index].active = hover;
                }

                function largeScreen(index) {
                    $scope.displayLargeScreen = true;
                    console.log(index)
                    $scope.largeScreenClass = 'open';

                    //$scope.images = JSON.parse($scope.images)

                    $scope.selectedImage = index;
                }

                $scope.keypress = function ($event) {
                    $scope.lastKey = $event.keyCode
                };

                $scope.changeFSIndex = function (index) {
                    var limit = $scope.images.length
                    console.log(limit)
                    if (index === 0) {

                        if ($scope.selectedImage <= 0) {

                        } else {
                            $scope.selectedImage -= 1;
                        }
                    } else {
                        if ($scope.selectedImage >= limit - 1) {

                        } else {
                            $scope.selectedImage += 1;
                        }
                    }
                    console.log($scope.selectedImage)
                }

                $scope.closeLargeScreen = function () {
                    $scope.largeScreenClass = 'closed';
                    $scope.displayLargeScreen = false;
                }

                $scope.selectImage = function ($index) {
                    largeScreen($index);
                }

                $scope.hover = function (hover, index) {
                    changeHoverState(hover, index);
                };
            },

            link: function (scope, elem, attrs, http) {


            }
        };
    });
