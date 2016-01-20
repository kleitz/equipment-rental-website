'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
    'ngRoute',
    'app.home',
    'app.login',
    'app.logout',
    'app.profile',
    'app.register',
    'app.users',
    'app.user',
    'app.image',
    'app.images',
    'app.imageupload',
    'app.item',
    'app.items',
    'app.sessions',
    'app.myItems',
    'app.creator',
    'app.ownerItems',
    'app.ownerItem',
    'app.cookie',

    // Directives
    'app.loginPanel',
    'app.registerPanel',
    'app.imageUploadForm',
    'app.rlabel',
    'app.availability',
    'app.rentButton',
    'app.rentButtonOwner',
    'app.qrcode',
    'app.limage',
    'app.cookiedisplay',
    'app.charLimit',
    // Factories
    'app.config',
    'app.auth',
    //  Dependencies
    'angularMoment',
    'ui-notification',
    'naif.base64',
    'ngColorThief'
]).config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
        $httpProvider.defaults.useXDomain = true;
    //console.log("its all set i guess")
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $routeProvider.otherwise({redirectTo: '/home'});
        $locationProvider.html5Mode(false);
    }])

    .controller('AuthCtrl', ['$scope', '$rootScope', 'authFactory', '$http', function ($scope, $rootScope, authFactory, $http) {
        $rootScope.loggedIn = authFactory.getAuth() !== undefined;
        // console.log( authFactory.getToken);
        $rootScope.auth = authFactory.getAuth();
        getSiteIndex()


        function getSiteIndex() {
            $http({
                url: backend + "/",
                method: 'GET',
            }).success(function (data, status, headers, config) {
                $rootScope.site = data;
            }).error(function (data, status, headers, config) {
                $rootScope.site = data;
            });
        }
    }]);
