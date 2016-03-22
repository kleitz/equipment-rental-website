'use strict';

angular.module('app.starRating', ['app.config'])
    .directive('starRating', function () {
        return {
            restrict: 'AEC',
            scope: {
                name: '@',
                value: '@',
                disableHover: '@'
            },
            templateUrl: 'components/starRating/starRating.html',
            controller: function ($scope) {
                $scope.value = $scope.value - 1;
                $scope.numOfStars = 5;
                $scope.numOfStarsObj = new Array($scope.numOfStars);
                $scope.highlightedStar = 0;
                $scope.stars = [];
                $scope.amount = {
                    'name': $scope.name,
                    'selected': Number($scope.value),
                    'hovered': Number($scope.value)
                };
                $scope.selecting = false;

                $scope.lockstar = function (index) {
                    if ($scope.disableHover !== 'true') {
                        $scope.amount.selected = index;
                        $scope.lock = !$scope.lock;
                        $scope.$emit('ratingChange', $scope.amount);
                        if ($scope.lock) {

                            for (var i = 0; i < $scope.numOfStars; i++) {
                                $scope.stars[i].class = $scope.stars[i].class + ' locked';
                            }
                        }
                        decorateStars(index);
                    }
                };

                for (var i = 0; i < $scope.numOfStars; i++) {
                    $scope.stars.push({'class': 'fa fa-star-o'})
                }

                decorateStars(Number($scope.value));

                $scope.range = function (n) {
                    return new Array(n);
                };

                $scope.getStarClass = function (index) {
                    //debugger
                    return $scope.stars[index].class;
                };

                $scope.lock = false;

                function decorateStars(index) {
                    for (var i = 0; i < $scope.numOfStars; i++) {
                        if (i <= index) {
                            $scope.stars[i].class = 'fa fa-star filled'
                        } else {
                            $scope.stars[i].class = 'fa fa-star-o empty'
                        }
                    }
                }

                $scope.setSelecting = function (value) {
                    if ($scope.disableHover !== 'true') {
                        $scope.selecting = value;
                        if (!value) {
                            decorateStars($scope.amount.selected);
                        }
                    }

                };


                $scope.RatingChange = function (index) {
                    //console.log(index)
                    if ($scope.disableHover !== 'true') {
                        updateRating(index);
                    }
                };

                function updateRating(index) {
                    //console.log(index)
                    if ($scope.disableHover === 'true') {

                    } else {

                        decorateStars(index);
                        $scope.amount.hovered = index;

                    }
                }
            },

            link: function (scope, elem, attrs, http) {


            }
        };
    });
