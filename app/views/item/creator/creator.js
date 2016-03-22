'use strict';

angular.module('app.creator', ['ngRoute'])

    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/create', {
                templateUrl: 'views/item/creator/creator.html',
                controller: 'itemCreatorCtrl'
            });
        }
    ])
    .controller('itemCreatorCtrl', ['$rootScope', '$scope', '$http', '$routeParams', 'authFactory', '$location', 'Notification',
        function ($rootScope, $scope, $http, $routeParams, authFactory, $location, Notification) {
            $scope.product = {
                owner: {
                    username: $rootScope.auth.username,
                    gravatar: $rootScope.auth.gravatar
                },
                tags: [],
                images: {0:{
                    size: {
                        'large': ''
                    }
                }}
            };
            $scope.DropZoneClass = 'animated';
            $scope.imagePreviewClass = '';
            $scope.message = {
                button: 'Create',
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
                    }
                }
            };
            $scope.uploadButtonClass = [];

            $scope.dropZoneEnter = function() {
                $scope.DropZoneClass = 'enter';
            };
            $scope.dropZoneLeave = function() {
                $scope.DropZoneClass = 'leave';
            };

            $scope.$on("$destroy", function(){
                $rootScope.bodyStyle.background = 'url() no-repeat center center fixed';

            });

            $scope.processFiles = function(file) {
                $scope.imagePreviewClass = 'leave';
                var fileReader = new FileReader();
                fileReader.onload = function (event) {
                    var uri = event.target.result;


                    $rootScope.bodyStyle.background = 'url(' + uri + ') no-repeat center center';

                        $scope.product.image.uri = uri.split(',')[1];
                        $scope.imagePreviewClass = 'new';



                    //$scope.DropZoneStyle.background = 'url(' + uri + ') no-repeat center center fixed'
                };
                $scope.product.image = {
                    'name': file[0].file.name,
                    'file_type': file[0].file.type
                };

                //setTimeout(function(){
                fileReader.readAsDataURL(file[0].file);
                //}, 300);


            };

            $scope.$watch('product.tagsstring', function() {
                $scope.product.tags = [];
                if ($scope.product.tagsstring) {
                    var tmp = $scope.product.tagsstring.split(',')
                    for (var i = 0; i < tmp.length; i++) {
                        $scope.product.tags.push({'tag': tmp[i].replace(/ /g,'')})
                    }
                }

            });


            if ($rootScope.loggedIn) {
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
                            if (product.image && product.title && product.description && product.days) {
                                $scope.message.button = $scope.message.loading;

                                var fd = new FormData();
                                fd.append('title', product.title);
                                fd.append('description', product.description);
                                fd.append('rental_period_limit', product.days);
                                fd.append('image', product.image.uri);
                                fd.append('tags', product.tagsstring);
                                fd.append('filetype', product.image.file_type);
                                fd.append('condition', product.condition);
                                fd.append('content', product.content)
                                
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
                                    Notification.success({
                                        message: 'Success, listing added',
                                        positionY: 'bottom',
                                        positionX: 'center',
                                        replaceMessage: true
                                    });
                                }).error(function (data, status, headers, config) {
                                    Notification.error({
                                        message: 'Oops something went wrong',
                                        positionY: 'bottom',
                                        positionX: 'center',
                                        replaceMessage: true
                                    });
                                    // $scope.success = false;

                                });
                            }
                        }
                    }
                }
            } else {

            }


        }]);
