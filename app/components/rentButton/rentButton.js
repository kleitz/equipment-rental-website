'use strict';

angular.module('app.rentButton', ['app.config'])
    .factory('RentStatus', function ($http, authFactory) {
        var RentStatus = {
            getAvailability: function (id) {
                return $http({
                    url: backend + '/p/' + id + '/availability',
                    method: 'GET',
                    headers: {
                        'token': authFactory.getToken()
                    }
                }).then(function (res) {
                    return res.data;
                });
            },
            getOwnerAvailability: function (id) {

                return $http({
                    url: backend + '/owner/products/' + id + '/availability',
                    method: 'GET',
                    headers: {
                        'token': authFactory.getToken()
                    }
                }).then(function (res) {
                    return res.data;
                });
            },
            getIsOwner: function (id) {
                return $http({
                    url: backend + '/product/' + id + '/owner',
                    method: 'GET',
                    headers: {
                        'token': authFactory.getToken()
                    }
                }).then(function (res) {
                    return res.data.owner;
                });
            },
            getRequestStatus: function (id) {
                return $http({
                    url: backend + '/product/' + id + '/request',
                    method: 'GET',
                    headers: {
                        'token': authFactory.getToken()
                    }
                }).then(function (res) {
                    return res.data;
                });
            }
        };
        return RentStatus;
    })
    .directive('rentButton', function () {
        return {
            restrict: 'AEC',
            scope: {
                datasource: '='
            },
            templateUrl: 'components/rentButton/rentButton.html',
            controller: function ($scope, $http, $rootScope, $location, $attrs, Notification, authFactory, RentStatus) {
                $scope.status = {
                    state: 'null',
                    isOwner: false,
                    isLoggedIn: false,
                    isHolding: false,
                    hasHolder: false,
                    normal: false,
                    hasRequest: false
                };
                //
                //
                ////$scope.datasource =  $attrs.datasource;
                //$scope.availability = "Loading.....";
                $scope.rentButtonClass = [];
                $scope.status.isLoggedIn = $rootScope.loggedIn;
                //var isOwner = false;

                $scope.$watch(
                    "datasource",
                    function handleFooChange() {
                        if ($scope.datasource !== undefined) {
                            if ($scope.datasource.owner !== '....') {
                                availability($scope.datasource)
                            } else {
                                $scope.showLoading = true;
                            }
                        }
                    }
                );

                function availability(data) {
                    $scope.rentButtonClass.splice("", 0);
                    RentStatus.getAvailability(data.id).then(function (status) {
                        //if (status.available) {
                        $scope.request = status;
                        RentStatus.getIsOwner(data.id).then(function (isowner) {
                            $scope.status.isOwner = isowner;
                            if (isowner) {
                                //    We are owner
                                RentStatus.getOwnerAvailability(data.id).then(function (res3) {
                                    $scope.ownerAvailResult = res3;
                                    if (res3.owner !== 'null') {
                                        //  Someone is holding it
                                        $scope.status.hasHolder = true;
                                        finished();
                                    } else {
                                        //    No one is holding the item
                                        RentStatus.getRequestStatus(data.id).then(function (requests) {
                                            $scope.RequestsStatus = requests;
                                            $scope.status.noHolder = true;
                                            finished();
                                        })

                                    }
                                })
                            } else {
                                // Get the request status
                                RentStatus.getRequestStatus(data.id).then(function (requests) {
                                    //    If we have requests
                                    $scope.status.hasRequest = requests.requested;
                                    $scope.userRequest = requests;
                                    if (requests.requested) {
                                        finished();
                                    } else {
                                        if (status.owner) {
                                        //    We are owner
                                            $scope.status.isHolding = true;

                                            finished();
                                        } else {
                                            finished();
                                        }

                                    }
                                });
                            }
                        })
                    })
                }


                function finished() {
                    $scope.status.gotRes = true;
                }

                $scope.click = function (id) {
                    if ($scope.availability === 'Unavailable') {
                        Notification.error({
                            message: '<i class="fa fa-exclamation-triangle"></i> ' + $scope.datasource.title + ' is not available. :(',
                            positionY: 'bottom',
                            positionX: 'center',
                            replaceMessage: true
                        });
                    } else {
                        rent();

                    }
                };
                //
                //function getOwnerStatus() {
                //    if ($rootScope.loggedIn) {
                //        $http({
                //            url: backend + '/product/' + $scope.datasource.id + '/owner',
                //            method: 'GET',
                //            headers: {
                //                'token': authFactory.getToken()
                //            },
                //        }).success(function (data, status, headers, config) {
                //            console.log(data)
                //            $scope.status.isOwner = data.owner;
                //            getRentalStatus();
                //        }).error(function (data, status, headers, config) {
                //            $scope.error = true;
                //        });
                //    }
                //
                //}
                //
                //function getOwnerAvailability() {
                //    if ($scope.status.isOwner) {
                //        $http({
                //            url: backend + '/owner/products/' + $scope.datasource.id + '/availability',
                //            method: 'GET',
                //            headers: {
                //                'token': authFactory.getToken()
                //            },
                //        }).success(function (data, status, headers, config) {
                //            console.log(data);
                //            $scope.ownerAvail = data;
                //            return data.owner
                //        }).error(function (data, status, headers, config) {
                //            console.log(data)
                //            $scope.error = true;
                //        });
                //    }
                //
                //}
                //
                //function getRequestStatus() {
                //    $http({
                //        url: backend + '/product/' + $scope.datasource.id + '/request',
                //        method: 'GET',
                //        headers: {
                //            'token': authFactory.getToken()
                //        },
                //    }).success(function (data, status, headers, config) {
                //        $scope.requestData = data;
                //        console.log(data)
                //        $scope.hasRequest = data.requested;
                //    }).error(function (data, status, headers, config) {
                //        $scope.error = true;
                //    });
                //}
                //
                //function getRentalStatus() {
                //    if ($rootScope.loggedIn) {
                //        $http({
                //            url: backend + '/p/' + $scope.datasource.id + '/availability',
                //            method: 'GET',
                //            headers: {
                //                'token': authFactory.getToken()
                //            },
                //        }).success(function (data, status, headers, config) {
                //            $scope.result = data;
                //
                //
                //            console.log(data)
                //            $scope.rentButtonClass.splice("", 0);
                //
                //            //$scope.status.isOwner = data.owner.username === $rootScope.auth.username;
                //
                //            // If it is available
                //            if (data.available) {
                //                // Check who we are
                //
                //                // If we are owner
                //                //getOwnerAvailability()
                //                //getOwnerStatus();
                //
                //                if ($scope.status.isOwner) {
                //                    getOwnerAvailability();
                //                    $scope.availability = $scope.ownerAvail
                //
                //                } else {
                //                    // If we are user
                //
                //                    $scope.availability = "Available";
                //                    $scope.rentButtonClass.push('button-green-filled');
                //
                //                }
                //
                //            } else {
                //                //if (!data.available) {
                //                //    if ($scope.gotRes) {
                //                //        if (data.owner) {
                //                //            $scope.holding = true;
                //                //            $scope.availability = 'You currently own this';
                //                //        } else {
                //                //            $scope.availability = "Unavailable";
                //                //            $scope.status = "Unavailable";
                //                //
                //                //        }
                //                //
                //                //    }
                //                //}
                //            }
                //        }).error(function (data, status, headers, config) {
                //            $scope.error = true;
                //        }).then(function() {
                //            console.log('poop')
                //            $scope.status.hasRes = true;
                //        });
                //    } else {
                //        $http({
                //            url: backend + '/p/' + $scope.datasource.id + '/availability',
                //            method: 'GET',
                //            // header: headers,
                //        }).success(function (data, status, headers, config) {
                //            $scope.gotRes = true;
                //            $scope.rentButtonClass.splice("", 0);
                //            if (data.available) {
                //                if ($scope.gotRes) {
                //                    $scope.availability = "Request Item";
                //                    $scope.status = "Available";
                //                    $scope.rentButtonClass.push('button-primary');
                //                }
                //            } else {
                //                if (!data.available) {
                //                    if ($scope.gotRes) {
                //                        $scope.availability = "Unavailable";
                //
                //                    }
                //                }
                //            }
                //        }).error(function (data, status, headers, config) {
                //            $scope.error = true;
                //        });
                //    }
                //}
                //
                function rent() {
                    if ($rootScope.loggedIn) {
                        $http({
                            url: backend + '/product/' + $scope.datasource.id + '/request',
                            method: 'POST',
                            headers: {
                                'token': authFactory.getToken()
                            }
                        }).success(function () {
                            Notification.success({
                                message: '<i class="fa fa-paper-plane"></i> ' + $scope.datasource.title + ' has just been requested. :)',
                                positionY: 'bottom',
                                positionX: 'center',
                                replaceMessage: true
                            });
                            $scope.status.hasRequest = true;
                            $scope.rentButtonClass = [];
                        }).error(function () {
                            $scope.error = true;
                        });
                    } else {
                        Notification.error({
                            message: 'You must be logged in',
                            positionY: 'bottom',
                            positionX: 'center',
                            replaceMessage: true
                        });
                    }
                }

                //
                ////console.log($rootScope.loggedIn)
                //
                //
                $scope.cancel = function () {
                    $http({
                        url: backend + '/product/' + $scope.datasource.id + '/request/cancel',
                        method: 'POST',
                        headers: {
                            'token': authFactory.getToken()
                        }
                    }).success(function () {
                        Notification.success({
                            message: '<i class="fa fa-paper-plane">   </i>    ' + $scope.datasource.title + ' request has been canceled. :(',
                            positionY: 'bottom',
                            positionX: 'center',
                            replaceMessage: true
                        });
                        $scope.status.hasRequest = false;
                    }).error(function () {
                        $scope.error = true;
                    });
                };

                $scope.return = function () {
                    if ($scope.status.isOwner) {
                        $http({
                            url: backend + '/p/' + $scope.datasource.id + '/return',
                            method: 'POST',
                            headers: {
                                'token': authFactory.getToken()
                            }
                        }).success(function (data) {
                            $scope.status.hasHolder = false;
                            $scope.status.noHolder = true;
                            RentStatus.getRequestStatus(data.id).then(function (requests) {
                                $scope.RequestsStatus = requests;
                                finished();
                            });
                            //getRentalStatus();
                            //getOwnerAvailability();
                        }).error(function () {
                            $scope.error = true;
                        });
                    }

                };
            },

            link: function (scope, elem, attrs, http) {


            }
        };
    });
