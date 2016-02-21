'use strict';

angular.module('app.loginPanel', ['app.config'])
    .directive('loginPanel', function() {
        return {
            restrict: 'AEC',
            scope: {
                datasource: '='
            },
            templateUrl: 'components/loginPanel/loginPanel.html',
            controller: function($scope, $http, $rootScope, $location, authFactory, Notification) {

                $scope.loading = false;
                $rootScope.$watch('noCookieUsage', function() {
                    $scope.cookiesHere = $rootScope.noCookieUsage;
                });

                $scope.enableCookie = function() {
                    console.log("enable cookies");
                    $rootScope.enableCookieSession = true;
                }

                $scope.login = function(user) {
                    $scope.loading = true;
                    $scope.showError = false;
                    if (user !== undefined && user !== "" && user.name !== "" && user.password !== "") {
                        var hash = CryptoJS.SHA512(user.password).toString();

                        $http({
                            url: backend + "/login",
                            method: 'POST',
                            data: {
                                'username': user.name,
                                'password': hash
                            },
                            headers: {
                                'Content-Type': 'multipart/form-data'

                            }
                        }).success(function(data, status, headers, config) {
                            authFactory.setAuth(data.token, data.username, data.gravatar, Date.parse(data.expiry), data.role)
                            $rootScope.auth = authFactory.getAuth();
                            $scope.error = false;
                            $rootScope.loggedIn = true;
                            $location.path( "/home");
                            $scope.loading = false;
                            Notification.success({message: 'こんにちは, ' + data.username, positionY: 'bottom', positionX: 'center', replaceMessage: true});
                        }).
                        error(function(data, status, headers, config) {
                            $scope.showError = true;
                            $scope.error = data.message;
                            $scope.loading = false;
                            Notification.error({message: 'Something went wrong', positionY: 'bottom', positionX: 'center', replaceMessage: true});
                        });
                    } else {
                        $scope.showError = true;
                        $scope.loading = false;
                        $scope.error = "You are missing values";
                        Notification.error({message: 'You are missing details', positionY: 'bottom', positionX: 'center', replaceMessage: true});
                    }


                };
            },
            link: function(scope, elem, attrs) {
                // Just for altering the DOM
            }
        };
    });
