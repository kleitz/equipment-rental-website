'use strict';

angular.module('app.registerPanel', ['app.config'])
    .directive('registerPanel', function() {
        return {
            restrict: 'AEC',
            scope: {
                datasource: '='
            },
            templateUrl: 'components/registerPanel/registerPanel.html',
            controller: function($scope, $http, $location) {
              $scope.$watch(
                "user.email",
                function handleFooChange( newValue, oldValue ) {
                  var hash = CryptoJS.MD5(newValue);
                  $scope.gravatar = hash.toString();
                }
              );
                $scope.register = function(user) {
                    // console.log(user);
                    console.log(user)
                    if (user !== undefined && user.name !== "" && user.email !== "" && user.password !== "" &&
                    user.name !== " " && user.email !== " " && user.recaptcha != "") {
                        console.log("time to register")
                        var hash = CryptoJS.SHA512(user.password).toString();

                        $http({
                            url: backend + "/user/register",
                            method: 'POST',
                            data: {
                                'username': user.name,
                                'password': hash,
                                'email':user.email,
                                'recaptcha': user.recaptcha,
                                'dateofbirth': user.dateOfBirth
                            },
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }).success(function(data, status, headers, config) {
                          $location.path('/login');
                        }).
                        error(function(data, status, headers, config) {
                            $scope.error = data.message;
                        });
                    }
                };
            },
            link: function(scope, elem, attrs) {
                // Just for altering the DOM
            }
        };
    });
