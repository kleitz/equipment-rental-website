'use strict';

angular.module('app.admin.listing', ['ngRoute'])

    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/admin/listing', {
                templateUrl: 'views/admin/products/products.html',
                controller: 'adminProductsCtrl'
            });
        }
    ])
    .controller('adminProductsCtrl', ['$rootScope', '$scope', '$http', 'authFactory', function ($rootScope, $scope, $http, authFactory) {
        if (window.localStorage.getItem("product_count")) {
            $scope.count = parseInt(window.localStorage.getItem("product_count"));
        } else {
            window.localStorage.setItem("product_count", 2);
            $scope.count = 2;
        }


        $scope.start = 0;
        if ($rootScope.loggedIn) {
            angular.element(document.getElementsByClassName('wrapper')).addClass('admin');
            angular.element(document.getElementsByClassName('navbar')).addClass('admin');

            getListing();



        } else {
            $scope.view = false;
        }

        $scope.$on('$locationChangeStart', function (event) {
            angular.element(document.getElementsByClassName('wrapper')).removeClass('admin');
            angular.element(document.getElementsByClassName('navbar')).removeClass('admin');
        });

        $scope.sendMessage = function(username, notification) {
            $http({
                url: backend + "/notification/user/" + username,
                method: 'POST',
                headers: {
                    'token': authFactory.getToken(),
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    'title': notification.title,
                    'message': notification.message
                })
            }).success(function(data, status, headers, config) {
                $scope.openContact = false;
                console.log(data)
            }).
            error(function(data, status, headers, config) {
                $scope.error = true;
            });
        };

        function getListing() {
            $http({
                url: backend + "/owner/products",
                method: 'GET',
                headers: {
                    'token': authFactory.getToken(),
                    'Start':$scope.start,
                    'Count':$scope.count
                }
            }).success(function(data, status, headers, config) {
                $scope.products = data;
                console.log(data);

                for (var i = 0; i < data.items.length; i++) {
                    console.log(data.items[i].owner)
                }
            }).
            error(function(data, status, headers, config) {
                $scope.error = true;
            });
        }


    }]);
