'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
    'ngRoute',
    'ngAnimate',
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
    'app.editor',
    'app.ownerItems',
    'app.ownerItem',
    'app.cookie',
    'app.tags',
    'app.search',
    'app.fourohfour',
    'app.requestProduct',
    'app.requestProducts',
    'app.myrequests',
    'app.owner',
    'app.owner.comments',

    //Admin panel views
    'app.admin',
    'app.admin.listing',
    'app.admin.authorize',
    'app.admin.site',
    'app.admin.users',

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
    'app.editorTag',
    'app.tagSearch',
    'app.imageViewer',
    'app.editorImage',
    'app.likeHeart',
    'app.imageGallery',
    'app.productSlider',
    'app.starRating',
    'app.discoveryItems',
    // Factories
    'app.config',
    'app.auth',
    'app.titleFactory',
    'app.historyFactory',
    //  Dependencies
    'angularMoment',
    'ui-notification',
    'ngColorThief',
    'angular-loading-bar',
    'vcRecaptcha',
    'textAngular',
    'infinite-scroll',
    '720kb.socialshare',
    'flow',
    'naif.base64'
]).config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        //console.log("its all set i guess")
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $routeProvider.otherwise({redirectTo: '/fourOhFour'});
        $locationProvider.html5Mode(false);
    }])
    .controller('AuthCtrl', ['$scope', '$rootScope', 'authFactory', '$http', '$timeout', 'Title', function ($scope, $rootScope, authFactory, $http, $timeout, Title) {
        $rootScope.loggedIn = authFactory.getAuth() !== undefined;
        // console.log( authFactory.getToken);
        $rootScope.auth = authFactory.getAuth();
        $scope.userDropDownShow = false;
        //console.log($rootScope.auth)

        $rootScope.bodyStyle = {
            background: 'url() no-repeat center center',
            '-webkit-background-size': 'cover',
            '-moz-background-size': 'cover',
            '-o-background-size': 'cover',
            'background-size': 'cover'
        };
        getSiteIndex();

        var toggle = false;
        $scope.showUserDropDown = function () {
            $scope.userDropDownShow = !$scope.userDropDownShow;
            $timeout(function () {
                $scope.$apply();
            }, 1);

        };


        window.addEventListener("mouseup", function onMouseUp() {
            // Make sure all menu items are closed
            $scope.userDropDownShow = false;
            $timeout(function () {
                $scope.$apply();
            }, 1);
        }, false);

        $scope.toggleNavi = function () {
            if (toggle) {
                angular.element(document.querySelector('.items')).css('display', 'none');
            } else {
                angular.element(document.querySelector('.items')).css('display', 'flex');

            }


            toggle = !toggle;
        };


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
    }])
    .filter('reverse', function () {
        // Filter from http://stackoverflow.com/questions/15266671/angular-ng-repeat-in-reverse
        return function (items) {
            return items.slice().reverse();
        };
    });
