'use strict';

angular.module('app.editorTag', ['app.config', 'app.auth'])
    .directive('editorTag', function() {
        return {
            restrict: 'AEC',
            scope: {
                'title': '@',
                'productid': '@',
                'index':'@'
            },
            templateUrl: 'components/editorTag/editorTag.html',
            controller: function($scope, $routeParams, $http, authFactory, $timeout) {
                $scope.tagclass = "editorTagBase";

                $scope.remove = function() {
                    console.log('removing tag ' + $scope.title + ' from ' + $scope.productid)
                    $http({
                        url: backend + '/product/' + $routeParams.id + '/tag/' + $scope.title + '/remove',
                        method: 'DELETE',
                        headers: {
                            'Content-Type': undefined,
                            'token': authFactory.getToken(),
                        }
                    }).success(function (data, status, headers, config) {
                        //$scope.tagclass = "editorTagBase animated fadeOut";

                        $scope.$emit('refreshTags', $scope.index);


                    }).error(function (data, status, headers, config) {
                        console.log('error');
                        $scope.error = true;
                    });
                };
            },
            link: function(scope, elem, attrs, http, authFactory) {

            }
        };
    });
