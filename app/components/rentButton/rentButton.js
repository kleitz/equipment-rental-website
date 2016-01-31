'use strict';

angular.module('app.rentButton', ['app.config'])
    .directive('rentButton', function () {
        return {
            restrict: 'AEC',
            scope: {
                datasource: '='
            },
            templateUrl: 'components/rentButton/rentButton.html',
            controller: function ($scope, $http, $rootScope, $location, $attrs, Notification, authFactory) {
                //$scope.datasource =  $attrs.datasource;
                $scope.availability = "Loading.....";
                $scope.status = "Loading...";
                $scope.rentButtonClass = [];
                $scope.loggedIn = $rootScope.loggedIn;
                var isOwner = false;

                $scope.$watch(
                    "datasource",
                    function handleFooChange(oldValue, newValue) {
                        if ($scope.datasource !== undefined) {
                            if ($scope.datasource.id !== undefined) {
                                $scope.showLoading = false;
                                // var headers = {};
                                // Check if we are a logged in user or not
                                getOwnerStatus();
                                getRentalStatus();
                                getRequestStatus();


                            } else {
                                $scope.showLoading = true;
                            }
                        }
                    }
                );

                $scope.click = function (id) {
                    if ($scope.availability === 'Unavailable') {
                        Notification.error({
                            message: '<i class="fa fa-exclamation-triangle"></i> ' + $scope.datasource.title + ' is not available. :(',
                            positionY: 'bottom',
                            positionX: 'center'
                        });
                    } else {
                        rent(id);

                    }
                }

                function getOwnerStatus() {
                    if ($rootScope.loggedIn) {
                        $http({
                            url: backend + '/product/' + $scope.datasource.id + '/owner',
                            method: 'GET',
                            headers: {
                                'token': authFactory.getToken()
                            },
                        }).success(function (data, status, headers, config) {
                            isOwner = data.owner;
                            $scope.isOwner = isOwner;
                            getOwnerAvailability();
                        }).error(function (data, status, headers, config) {
                            $scope.error = true;
                        });
                    }

                }

                function getOwnerAvailability() {
                    if (isOwner) {
                        $http({
                            url: backend + '/owner/products/' + $scope.datasource.id + '/availability',
                            method: 'GET',
                            headers: {
                                'token': authFactory.getToken()
                            },
                        }).success(function (data, status, headers, config) {
                            console.log(data);
                            $scope.ownerAvail = data;
                        }).error(function (data, status, headers, config) {
                            $scope.error = true;
                        });
                    }

                }

                function getRequestStatus() {
                    $http({
                        url: backend + '/product/' + $scope.datasource.id + '/request',
                        method: 'GET',
                        headers: {
                            'token': authFactory.getToken()
                        },
                    }).success(function (data, status, headers, config) {
                        $scope.requestData = data;
                        console.log(data)
                        $scope.hasRequest = data.requested;
                    }).error(function (data, status, headers, config) {
                        $scope.error = true;
                    });
                }

                function getRentalStatus() {
                    if ($rootScope.loggedIn) {
                        $http({
                            url: backend + '/p/' + $scope.datasource.id + '/availability',
                            method: 'GET',
                            headers: {
                                'token': authFactory.getToken()
                            },
                        }).success(function (data, status, headers, config) {
                            $scope.result = data;
                            console.log(data)


                            $scope.gotRes = true;
                            $scope.rentButtonClass.splice("", 0);
                            if (data.available) {
                                if ($scope.gotRes) {
                                    $scope.availability = "Available";
                                    $scope.rentButtonClass.push('button-primary');
                                }
                            } else {
                                if (!data.available) {
                                    if ($scope.gotRes) {
                                        if (data.owner) {
                                            $scope.holding = true;
                                            $scope.availability = 'You current own this';
                                        } else {
                                            $scope.availability = "Unavailable";
                                            $scope.status = "Unavailable";

                                        }

                                    }
                                }
                            }
                        }).
                        error(function (data, status, headers, config) {
                            $scope.error = true;
                        });
                    } else {
                        $http({
                            url: backend + '/p/' + $scope.datasource.id + '/availability',
                            method: 'GET',
                            // header: headers,
                        }).success(function (data, status, headers, config) {
                            $scope.gotRes = true;
                            $scope.rentButtonClass.splice("", 0);
                            if (data.available) {
                                if ($scope.gotRes) {
                                    $scope.availability = "Request Item";
                                    $scope.status = "Available";
                                    $scope.rentButtonClass.push('button-primary');
                                }
                            } else {
                                if (!data.available) {
                                    if ($scope.gotRes) {
                                        $scope.availability = "Unavailable";

                                    }
                                }
                            }
                        }).error(function (data, status, headers, config) {
                            $scope.error = true;
                        });
                    }
                }

                function rent(id) {
                    if ($rootScope.loggedIn) {
                        $http({
                            url: backend + '/product/' + $scope.datasource.id + '/request',
                            method: 'POST',
                            headers: {
                                'token': authFactory.getToken()
                            },
                        }).success(function (data, status, headers, config) {
                            Notification.success({
                                message: '<i class="fa fa-paper-plane"></i> ' + $scope.datasource.title + ' has just been requested. :)',
                                positionY: 'bottom',
                                positionX: 'center'
                            });
                            $scope.hasRequest = true;
                            getRentalStatus();
                            $scope.rentButtonClass = [];
                        }).error(function (data, status, headers, config) {
                            $scope.error = true;
                        });
                    } else {
                        Notification.error({
                            message: 'You must be logged in',
                            positionY: 'bottom',
                            positionX: 'center'
                        });
                    }
                }

                console.log($rootScope.loggedIn)

                $scope.cancel = function(id) {
                    $http({
                        url: backend + '/product/' + $scope.datasource.id + '/request/cancel',
                        method: 'POST',
                        headers: {
                            'token': authFactory.getToken()
                        },
                    }).success(function (data, status, headers, config) {
                        Notification.success({
                            message: '<i class="fa fa-paper-plane"></i> ' + $scope.datasource.title + ' request has been canceled. :(',
                            positionY: 'bottom',
                            positionX: 'center'
                        });
                        getRentalStatus();
                        $scope.hasRequest = false;
                    }).error(function (data, status, headers, config) {
                        $scope.error = true;
                    });
                };

                $scope.return = function (id) {
                    if (isOwner) {
                        $http({
                            url: backend + '/p/' + $scope.datasource.id + '/return',
                            method: 'POST',
                            headers: {
                                'token': authFactory.getToken()
                            },
                        }).success(function (data, status, headers, config) {
                            getRentalStatus();
                            getOwnerAvailability();
                        }).
                        error(function (data, status, headers, config) {
                            $scope.error = true;
                        });
                    }

                };
            },

            link: function (scope, elem, attrs, http) {


            }
        };
    });
