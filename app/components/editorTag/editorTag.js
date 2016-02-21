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
            controller: function($scope, $routeParams, $http, authFactory, $timeout, Notification) {
                $scope.tagclass = "editorTagBase";

                $scope.remove = function() {
                    Notification.info({message: 'Removing ' + $scope.title, positionY: 'bottom', positionX: 'center', replaceMessage: true});
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
                        Notification.success({message: 'Tag ' + $scope.title + ' has been removed', positionY: 'bottom', positionX: 'center', replaceMessage: true});
                        $scope.$emit('refreshTags', $scope.index);


                    }).error(function (data, status, headers, config) {
                        console.log('error');
                        Notification.error({message: 'Error removing ' + $scope.title, positionY: 'bottom', positionX: 'center', replaceMessage: true});
                        $scope.error = true;
                    });
                };
            },
            link: function(scope, elem, attrs, http, authFactory) {

            }
        };
    });
