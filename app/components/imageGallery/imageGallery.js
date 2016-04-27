'use strict';

angular.module('app.imageGallery', ['app.config'])
    .directive('imageGallery', function () {
        return {
            restrict: 'AEC',
            scope: {
                images: '@'
            },
            templateUrl: 'components/imageGallery/imageGallery.html',
            controller: function ($scope) {
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
                });

                $scope.changeImage = function (index) {
                    changeImage(index);
                };

                var previousIndexPreview = 100;

                function changeImage(index) {

                    setTimeout(function () {
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
                    $scope.largeScreenClass = 'open';

                    $scope.selectedImage = index;
                    $scope.selectedImageLocation = $scope.images[index].location
                }

                $scope.keypress = function ($event) {
                    $scope.lastKey = $event.keyCode
                };

                $scope.changeFSIndex = function (index) {
                    var limit = $scope.images.length;
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
                    $scope.selectedImageLocation = $scope.images[index].location
                };

                $scope.closeLargeScreen = function () {
                    $scope.largeScreenClass = 'closed';
                    $scope.displayLargeScreen = false;
                };

                $scope.selectImage = function ($index) {
                    largeScreen($index);
                };

                $scope.hover = function (hover, index) {
                    changeHoverState(hover, index);
                };
            }
        };
    });
