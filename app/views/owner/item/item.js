'use strict';

angular.module('app.ownerItem', ['ngRoute'])

    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/owner/listing/:id', {
                templateUrl: 'views/owner/item/item.html',
                controller: 'ownerItemCtrl'
            });
        }
    ])
    .controller('ownerItemCtrl', ['$rootScope', '$scope', '$http', '$routeParams', 'authFactory', '$location', function ($rootScope, $scope, $http, $routeParams, authFactory, $location) {
        $scope.domain = domain;
        $http({
            url: backend + "/product/" + $routeParams.id,
            method: 'GET',
        }).success(function (data, status, headers, config) {
            $scope.product = data.items[0];
        }).error(function (data, status, headers, config) {
            $scope.error = true;
        });

        $scope.deleteItem = function () {
            //console.log("deleteing");
            $http({
                url: backend + '/product/' + $routeParams.id + '/delete',
                method: 'DELETE',
                headers: {
                    'token': authFactory.getToken()
                },
            }).success(function (data, status, headers, config) {
                $location.path('/owner/listing');
            }).error(function (data, status, headers, config) {
                $scope.error = true;
            });
        };

    }]);
