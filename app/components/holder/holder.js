'use strict';

angular.module('app.holder', ['app.config'])
    .directive('getHolder', function() {
        return {
            restrict: 'AEC',
            scope: {
                source: '@'
            },
            templateUrl: 'components/holder/holder.html',
            controller: function($scope, $http, $rootScope, $location, $attrs) {


                $scope.$watch(
                    "source",
                    function handleFooChange() {
                        if ($attrs.source != "{{product}}" && $attrs.source != 'undefined' && $attrs.source != '') {
                            var value = JSON.parse($attrs.source);
                            $scope.showLoading = false;
                            $http({
                                url: backend + '/identify/qr/' + $attrs.type,
                                method: 'GET',
                                headers: {
                                    'code': value.id,
                                    'height': $attrs.height,
                                    'width': $attrs.width
                                }
                            }).success(function(data) {
                                $scope.qr = data;
                            }).error(function() {
                                $scope.error = true;
                            });
                        } else {
                            $scope.showLoading = true;
                        }
                    }
                );
            },

            link: function(scope, elem, attrs, http) {


            }
        };
    });
