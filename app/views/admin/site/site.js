'use strict';

angular.module('app.admin.site', ['ngRoute'])

    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/admin/site', {
                templateUrl: 'views/admin/site/site.html',
                controller: 'adminSiteCtrl'
            });
        }
    ])
    .controller('adminSiteCtrl', ['$rootScope', '$scope', '$http', 'authFactory', function ($rootScope, $scope, $http, authFactory) {
        if (window.localStorage.getItem("product_count")) {
            $scope.count = parseInt(window.localStorage.getItem("product_count"));
        } else {
            window.localStorage.setItem("product_count", 2);
            $scope.count = 2;
        }
        $scope.message = {
            button: 'Edit',
            submit: 'loading',
            loading: 'processing',
            failed: 'failed',
            error: {
                image: {
                    enable: false,
                    text: 'image cannot be empty'
                },
                title: {
                    enable: false,
                    text: 'title cannot be empty'
                },
                description: {
                    enable: false,
                    text: 'description cannot be empty'
                },
                days: {
                    enable: false,
                    text: 'days cannot be empty'
                },
            }
        };


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

        $scope.update = function(site) {
            console.log(site)
            var fd = new FormData();
            fd.append('title', site.title);
            fd.append('description', site.description);
            $http({
                url: backend + "/",
                method: 'POST',
                headers: {
                    'Content-Type': undefined,
                    'token': authFactory.getToken()
                },
                data: fd
            }).success(function(data, status, headers, config) {
                $scope.site = site;
                console.log(data)
            }).
            error(function(data, status, headers, config) {
                $scope.error = true;
            });
        };

        function getListing() {
            $http({
                url: backend + "/",
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
