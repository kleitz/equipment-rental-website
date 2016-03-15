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
    .controller('itemCtrl', ['$rootScope', '$scope', '$http', '$routeParams', '$location', 'Configuration', 'authFactory', 'Notification',
        function ($rootScope, $scope, $http, $routeParams, $location, Configuration, authFactory, Notification) {
            $scope.product = {
                age_rating: 0,
                comments_enabled: true,
                comments_require_approval: false,
                condition: "....",
                content: "<p>....</p>",
                date_added: Date.now(),
                date_updated: Date.now(),
                description: '....',
                images: '',
                likes: 0,
                owner: '....',
                product_rental_period_limit: 0,
                title: ".....",
                gotRes: false,
            };
            var enableQuickEdit = true;

            $scope.$on("$destroy", function () {
                $rootScope.bodyStyle.background = 'url() no-repeat center center';

            });
            $scope.message = {
                'processing': 'false'
            };
            $scope.itemClass = '';
            $scope.domain = domain;
            var revealEdit = false;
            $scope.revealEdit = function() {
                console.log("reveal edit")
                revealEdit = !revealEdit;

                if (revealEdit) {
                    $scope.itemClass = 'edit';
                } else {
                    $scope.itemClass = '';
                }

                $scope.showContentEditor = revealEdit;
                $scope.showTitleEditor = revealEdit;
                $scope.showDescriptionEditor = revealEdit;
                $scope.showAgeEdit = revealEdit;
            }

            if (enableQuickEdit) {
                $scope.setShowContentEditorEdit = function (value) {
                    if ($scope.isOwner) {
                        $scope.showContentEditorEdit = value;

                        if (value) {
                            $scope.showContentButtonClass = 'entering';
                        } else {
                            $scope.showContentButtonClass = 'leaving';
                        }
                    }
                };
                $scope.setShowTitleEdit = function (value) {
                    if ($scope.isOwner) {
                        $scope.showTitleEdit = value;

                        if (value) {
                            $scope.showTitleButtonClass = 'entering';
                        } else {
                            $scope.showTitleButtonClass = 'leaving';
                        }
                    }

                };
                $scope.setShowDescriptionEdit = function (value) {
                    if ($scope.isOwner) {
                        $scope.showDescriptionEdit = value;

                        if (value) {
                            $scope.showDescriptionButtonClass = 'entering';
                        } else {
                            $scope.showDescriptionButtonClass = 'leaving';
                        }
                    }
                };
                $scope.setShowAgeEdit = function (value) {
                    if ($scope.isOwner) {
                        $scope.showAgeEdit = value;

                        if (value) {
                            $scope.showAgeButtonClass = 'entering';
                        } else {
                            $scope.showAgeButtonClass = 'leaving';
                        }
                    }
                };

                $scope.addAge = function (value) {
                    if ($scope.isOwner) {
                        $scope.product.age_rating = $scope.product.age_rating + value;
                        //debugger
                        $scope.edit();
                    }
                };
                $scope.deductAge = function (value) {
                    if ($scope.isOwner) {
                        $scope.product.age_rating--;
                        $scope.edit();
                    }
                };
            }



            $http({
                url: backend + "/product/" + $routeParams.id,
                method: 'GET',
                headers: {
                    'token': authFactory.getToken()
                }
            }).success(function (data, status, headers, config) {
                $scope.product = data.items[0];
                console.log(data.items[0]);
                $scope.product.gotRes = true;
                if (data.items[0].owner.username === $rootScope.auth.username) {
                    $scope.isOwner = true;
                } else {
                    $scope.isOwner = false;
                }

                $rootScope.bodyStyle.background = 'url(' + domain + data.items[0].images[0].size.large + ') no-repeat center center';
                //$scope.url = domain + data.items[0].image.size.large
            }).error(function (data, status, headers, config) {
                console.log('error');
                $scope.error = true;
            });

            $scope.addComment = function (comment) {
                $scope.message.processing = true;
                //if (comment.message.length > 5) {


                    sendComment(comment.message);

                //}
            };

            $scope.deleteComment = function (cid, index) {
                deleteComment(cid, index);
            };

            $scope.approveComment = function (cid, id) {
                $http({
                    url: backend + "/product/" + $routeParams.id + '/comment/' + cid + '/approve',
                    method: 'POST',
                    headers: {
                        'token': authFactory.getToken()
                    }
                }).success(function (data, status, headers, config) {
                    $scope.product.comments[index].approved = true;
                }).error(function (data, status, headers, config) {
                    console.log('error');
                }).finally(function () {
                });
            };

            $scope.random = function () {
                return 0.5 - Math.random();
            };

            $scope.edit = function () {
                var product = $scope.product
                var fd = new FormData();
                fd.append('title', product.title);
                fd.append('description', product.description);
                fd.append('rental_period_limit', product.product_rental_period_limit);
                fd.append('condition', product.condition);
                fd.append('comments_require_approval', product.product_rental_period_limit)
                fd.append('comments_enabled', product.comments_enabled)
                fd.append('content', product.content)
                fd.append('age_rating', product.age_rating);
                console.log(product)
                $http({
                    url: backend + '/product/' + $routeParams.id + '/edit',
                    method: 'POST',
                    headers: {
                        'Content-Type': undefined,
                        'token': authFactory.getToken()
                    },
                    data: fd
                }).success(function (data, status, headers, config) {
                    Notification.success({message: 'Edited successfully', positionY: 'bottom', positionX: 'center'});
                    $scope.showContentEditor = false;
                    $scope.showTitleEditor = false;
                    $scope.showDescriptionEditor = false;
                    $scope.showAgeEditor = false;
                    $scope.showConditionEditor = false;
                }).error(function (data, status, headers, config) {
                    Notification.error({
                        message: 'Error: Something went wrong',
                        positionY: 'bottom',
                        positionX: 'center'
                    });
                    $scope.error = true;
                });
            };

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
                    Notification.success({
                        message: 'Comment added: ' + comment,
                        positionY: 'bottom',
                        positionX: 'center',
                        replaceMessage: true
                    });
                    $scope.product.comments.push({
                        'message': comment,
                        'date_added': Date(),
                        'author': {
                            'username': $rootScope.auth.username,
                            'gravatar': $rootScope.auth.gravatar
                        }

                    });

                    $scope.comment.message = "";
                }).error(function (data, status, headers, config) {
                    console.log('error');
                    Notification.error({
                        message: 'Something went wrong',
                        positionY: 'bottom',
                        positionX: 'center',
                        replaceMessage: true
                    });
                    $scope.comment.success = true;
                }).finally(function () {
                    //console.log("its over")
                    $scope.message.processing = false;
                });
            }

            $scope.deleteItem = function () {
                //console.log("deleteing");
                $http({
                    url: backend + '/product/' + $routeParams.id + '/delete',
                    method: 'DELETE',
                    headers: {
                        'token': authFactory.getToken()
                    },
                }).success(function (data, status, headers, config) {
                    $location.path('/listing');
                    Notification.success({
                        message: 'Item has been deleted',
                        positionY: 'bottom',
                        positionX: 'center',
                        replaceMessage: true
                    });
                }).error(function (data, status, headers, config) {
                    $scope.error = true;
                    Notification.error({
                        message: 'Something went wrong',
                        positionY: 'bottom',
                        positionX: 'center',
                        replaceMessage: true
                    });
                });
            };

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
                    //console.log("its over")
                    $scope.message.processing = false;
                });
            }


        }]);
