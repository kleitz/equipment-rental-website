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
    'app.about',
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

    // Services
    'app.notify',

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
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $routeProvider.otherwise({redirectTo: '/fourOhFour'});
        $locationProvider.html5Mode(false);
    }])
    .controller('timelineCtrl', ['notify', '$http', 'authFactory', function (notify, $http, authFactory) {
        getTimeline();
        function getTimeline() {
            getData();
        }

        function getData() {
            $http({
                url: backend + "/p/rent/current",
                method: 'GET',
                headers: {
                    'Count': 3000,
                    'token': authFactory.getToken()
                }
            }).success(function (data, status, headers, config) {
                for (var i = 0; i < data.items.length; i++) {
                    var days = -moment().diff(Date.parse(data.items[i].due), 'days');
                    var hours = -moment().diff(Date.parse(data.items[i].due), 'hours');
                    if (days < 3) {
                        if (hours < 48) {
                            notify.show('DUE IN ' + hours + ' HOURS: ' + data.items[i].title, domain + data.items[i].images[0].size.thumb, 10000, domain, 'error')
                        } else {
                            notify.show('Due soon: ' + data.items[i].title, domain + data.items[i].images[0].size.thumb, 10000, domain, 'warning')
                        }
                    }
                }
            }).error(function (data, status, headers, config) {
                notify.show('Something went wrong', '', 1000, domain, 'error')
            });
        }
    }])
    .controller('AuthCtrl', ['$scope', '$rootScope', 'authFactory', '$http', '$timeout', 'Title',
        function ($scope, $rootScope, authFactory, $http, $timeout, Title) {
            $rootScope.loggedIn = authFactory.getAuth() !== undefined;
            $rootScope.auth = authFactory.getAuth();
            $scope.userDropDownShow = false;

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
        }]);
