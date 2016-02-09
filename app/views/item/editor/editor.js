'use strict';

angular.module('app.editor', ['ngRoute'])

    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/listing/:id/edit', {
                templateUrl: 'views/item/editor/editor.html',
                controller: 'itemEditorCtrl'
            });
        }
    ])
    .controller('itemEditorCtrl', ['$rootScope', '$scope', '$http', '$routeParams', 'authFactory', '$location', 'Notification', function ($rootScope, $scope, $http, $routeParams, authFactory, $location, Notification) {

        function loadData() {
            $http({
                url: backend + "/product/" + $routeParams.id,
                method: 'GET',
            }).success(function (data, status, headers, config) {
                $scope.product = data.items[0];
                $scope.product.days = data.items[0].product_rental_period_limit;

                //var tags = [];
                //for (var i = 0; i < data.items[0].tags.length; i++) {
                //    tags.push(data.items[0].tags[i].tag)
                //}
                //$scope.product.tags = tags.toString();

                console.log(data.items[0])
                $scope.product.image = domain + data.items[0].image[0].size.large;
                //$scope.url = domain + data.items[0].image.size.large
            }).error(function (data, status, headers, config) {
                console.log('error');
                $scope.error = true;
            });
        }

        $scope.addTag = function() {
            addTag();
        }

        function getTags() {
            $http({
                url: backend + '/product/' + $routeParams.id + '/tags',
                method: 'GET',
            }).success(function (data, status, headers, config) {
                $scope.product.tags = data;
                $scope.product.input.tags = '';
            }).error(function (data, status, headers, config) {
                $scope.error = true;
            });
        }

        $scope.$on('refreshTags', function(index) {
            $scope.product.tags.splice(index.targetScope.index, 1);
        });

        function addTag() {
            $http({
                url: backend + '/product/' + $routeParams.id + '/tag',
                method: 'POST',
                headers: {
                    'Content-Type': undefined,
                    'token': authFactory.getToken(),
                    'tags': $scope.product.input.tags
                }
            }).success(function (data, status, headers, config) {
                var tags = $scope.product.input.tags;
                tags = tags.split(",")
                for (var i = 0; i < tags.length; i++) {
                    $scope.product.tags.push({'tag': tags[i]});
                }

                $scope.product.input.tags = '';

            }).error(function (data, status, headers, config) {
                console.log('error');
                $scope.error = true;
            });
        }

        $scope.product = {};
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
        $scope.uploadButtonClass = [];

        $scope.uploadAnotherImage = function(newImage) {
            var fd = new FormData();
            fd.append('image', newImage.base64[0].base64);
            fd.append('filetype', newImage.base64[0].filetype);

            $http({
                url: backend + "/product/" + $routeParams.id + "/image/add",
                method: 'POST',
                dataType: 'multipart/form-data',
                data: fd,
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                    'token': authFactory.getToken(),
                }
            }).success(function (data, status, headers, config) {
                console.log(data)
            }).error(function (data, status, headers, config) {

                // $scope.success = false;

            });
        }
        $scope.fileChange = function(data) {
            var file = document.getElementById('fileUploader').files[0];
            var preview = document.getElementById('newimagePreview');
            if (file) {
                var reader  = new FileReader();
                reader.onloadend = function () {
                    preview.src = reader.result;
                }
                reader.readAsDataURL(file)
            }
        }

        $scope.edit = function(product) {
            var fd = new FormData();
            fd.append('title', product.title);
            fd.append('description', product.description);
            fd.append('rental_period_limit', product.days);
            fd.append('condition', product.condition);
            $http({
                url: backend + '/product/' + $routeParams.id + '/edit',
                method: 'POST',
                headers: {
                    'Content-Type': undefined,
                    'token': authFactory.getToken()
                },
                data: fd
            }).success(function (data, status, headers, config) {
                Notification.success({message:'Edited successfully', positionY: 'bottom', positionX: 'center'});

            }).error(function (data, status, headers, config) {
        Notification.error({message: 'Error: Something went wrong', positionY: 'bottom', positionX: 'center'});
                $scope.error = true;
            });
        }



        if ($rootScope.loggedIn) {
            loadData();

            $scope.create = function (product) {
                if (!$scope.uploadSuccess) {


                    if (!product.base64) {
                        $scope.message.error.image.enable = true;
                    } else {
                        $scope.message.error.image.enable = false;
                    }

                    if (!product.title) {
                        $scope.message.error.title.enable = true;
                    } else {
                        $scope.message.error.title.enable = false;
                    }

                    if (!product.description) {
                        $scope.message.error.description.enable = true;
                    } else {
                        $scope.message.error.description.enable = false;
                    }

                    if (!product.days) {
                        $scope.message.error.days.enable = true;
                    } else {
                        $scope.message.error.days.enable = false;
                    }


                    if (product) {
                        if (product.base64 && product.title && product.description && product.days) {
                            console.log(product);
                            // $scope.uploadButtonClass.push('button-primary');
                            $scope.message.button = $scope.message.loading;

                            var fd = new FormData();
                            fd.append('title', product.title);
                            fd.append('description', product.description);
                            fd.append('rental_period_limit', product.product_rental_period_limit);
                            fd.append('tags', product.tags);

                            $http({
                                url: backend + "/p",
                                method: 'POST',
                                dataType: 'multipart/form-data',
                                data: fd,
                                transformRequest: angular.identity,
                                headers: {
                                    'Content-Type': undefined,
                                    'token': authFactory.getToken(),
                                }
                            }).success(function (data, status, headers, config) {
                                $location.path('/listing/' + data.items[0].id);
                            }).error(function (data, status, headers, config) {

                                // $scope.success = false;

                            });
                        }
                    }
                }
            }
        }

    }]);
