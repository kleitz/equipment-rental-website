'use strict';

angular.module('app.item', ['ngRoute', 'app.config'])

    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/listing/:id', {
                templateUrl: 'views/item/item.html',
                controller: 'itemCtrl'
            });
        }
    ])
    .controller('itemCtrl', ['$rootScope', '$scope', '$http', '$routeParams', '$location', 'Configuration', 'authFactory', function ($rootScope, $scope, $http, $routeParams, $location, Configuration, authFactory) {
        $scope.message = {
            'processing': 'false'
        }
        $http({
            url: backend + "/product/" + $routeParams.id,
            method: 'GET',
        }).success(function (data, status, headers, config) {
            $scope.product = data.items[0];
            console.log(data.items[0])
            //$scope.url = domain + data.items[0].image.size.large
        }).error(function (data, status, headers, config) {
            console.log('error');
            $scope.error = true;
        });

        $scope.addComment = function (comment) {
            $scope.message.processing = true;
            if (comment.message.length > 5) {
                $scope.product.comments.push({
                    "message": comment.message,
                    "date_added": Date()
                });

                sendComment(comment.message);

                $scope.comment.message = "";
            }
        };

        $scope.deleteComment = function(cid, index) {
            deleteComment(cid, index);
        }

        function sendComment(comment) {
            //    /product/:pid/comment
            $http({
                url: backend + "/product/" + $routeParams.id + '/comment',
                method: 'POST',
                headers: {
                    'token': authFactory.getToken(),
                    'comment': comment
                }
            }).success(function (data, status, headers, config) {
                $scope.comment.success = true;
            }).error(function (data, status, headers, config) {
                console.log('error');
                $scope.comment.success = true;
            }).finally(function () {
                console.log("its over")
                $scope.message.processing = false;
            });
        }

        function deleteComment(cid, index) {
            //    /product/:pid/comment
            $http({
                url: backend + "/product/" + $routeParams.id + '/comment/' + cid,
                method: 'DELETE',
                headers: {
                    'token': authFactory.getToken()
                }
            }).success(function (data, status, headers, config) {
                $scope.product.comments.splice(index, 1);
            }).error(function (data, status, headers, config) {
                console.log('error');
                $scope.comment.success = true;
            }).finally(function () {
                console.log("its over")
                $scope.message.processing = false;
            });
        }


    }]);
