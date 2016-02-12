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
                var images;
                $scope.displayLargeScreen = false;
                $scope.isHovering = [{'active': false}, {'active': false}, {'active': false}];
                $scope.$watch('images', function (val) {
                    if (val) {
                        images = angular.fromJson(val);
                        console.log(images);
                        $scope.source = images;
                        $scope.domain = domain;
                        changeImage(0);
                    }
                    // do something
                });

                $scope.changeImage = function (index) {
                    changeImage(index);
                };

                function changeImage(index) {
                    //$scope.showImage = images[index].size.large;
                    //var ele = angular.element(document.querySelector('#thisshowcase'));
                    //ele.addClass('animated fadeOut');
                    //ele.addClass('animated  fadeIn')
                    $scope.showcaseImage = {
                        'background': 'url(' + domain + images[index].size.large + ') no-repeat center center',
                        'background-size': 'contain'
                    };
                    //$timeout(function () {
                    //    ele.removeClass('animated fadeIn')
                    //
                    //}, 1000);
                }


                function changeHoverState(hover, index) {
                    $scope.isHovering[index].active = hover;
                }

                function largeScreen(index) {
                    $scope.displayLargeScreen = true;
                    $scope.selectedImage = images[index];
                }

                $scope.closeLargeScreen = function () {
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
