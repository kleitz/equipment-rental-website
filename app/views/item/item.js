'use strict';

angular.module('app.item', ['ngRoute', 'app.config'])

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/listing/:id', {
            templateUrl: 'views/item/item.html',
            controller: 'itemCtrl'
        });
    }
])
.controller('itemCtrl', ['$rootScope', '$scope', '$http', '$routeParams', '$location', 'Configuration', function($rootScope, $scope, $http, $routeParams, $location, Configuration) {
        $http({
            url: backend + "/product/" + $routeParams.id,
            method: 'GET',
        }).success(function(data, status, headers, config) {
            debugger;
            if ($rootScope.loggedIn) {
                if (data.items[0].owner.username === $rootScope.auth.username) {
                    $location.path('/owner/listing/' + $routeParams.id);
                }

            }
            $scope.product = data.items[0];

            $scope.url = data + data.items[0].image.size.large
        }).
        error(function(data, status, headers, config) {
          console.log('error');
            $scope.error = true;
        });



}]);
