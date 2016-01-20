'use strict';

angular.module('app.charLimit', ['app.config'])
    .directive('charLimit', function () {
        return {
            restrict: 'EA',
            scope: {
                'limit': '=',
                'input': '@'
            },
            template: '<span ng-style="charLimitStyles">{{limit - input.length}}</span>',
            link: function (scope, elem, attrs) {
                scope.count = attrs.limit;
                var colour = {
                    'safe': '#333',
                    'warning': '#FF9800',
                    'error': '#e53935'
                };
                scope.charLimitStyles = {
                    'color': 'black'
                };

                attrs.$observe('input', function (value) {
                    var percentage = value.length / attrs.limit * 100;
                    if (percentage < 50) {
                        scope.charLimitStyles.color = colour.safe;
                    } else if (percentage < 85) {
                        scope.charLimitStyles.color = colour.warning;
                    } else {
                        scope.charLimitStyles.color = colour.error;
                    }
                });
            }
        };
    });
