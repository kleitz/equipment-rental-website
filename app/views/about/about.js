'use strict';

angular.module('app.about', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/about', {
            templateUrl: 'views/about/about.html',
            controller: 'aboutCtrl'
        });
    }])

    .controller('aboutCtrl', ['$scope', '$rootScope', 'authFactory', function($scope, $rootScope, authFactory) {
        var abstract = '<img src="assets/images/transparent.png" width="500px" height="auto"/> <br>Equipment Booking Service is a software solution which includes a web app and mobile app. These apps allow users to be able to search request and rent items from other users easily and simply.<br><br>' +

        'The aim of the project is to simplify and solve the issue in the Computing building at University of Dundee, where there is no set procedure in which students are able to find what equipment is available upon request to rent.<br><br>' +

        'Another issue with the current methods is that there is no way of knowing where and when students have to return the equipment other than to return to the equipment owner. This causes confusion and leads to equipment never being returned.<br><br>' +

        'The final product is an AngularJS web app and Ionic app that can be installed on an Android and IOS device powered by a Golang web API to provide a rich and performant experience that allows users to interact with the service without issues.<br><br>'



        $scope.content = {
            title: "The Equipment Booking Service Project",
            content: [{
                "title": "Abstract",
                "content": abstract
            }, {
                "title": "Web app",
                "content": "The web app you are currently viewing is the webapp for the project, to start select home from the top or <br><a class='button' href='#/home'>click here</a>"
            }, {
                "title": "Mobile App",
                "content": "A mobile app has been developed alongside the web app and can be downloaded for Android from Github <br><a class='button' href='https://github.com/remony/equipment-rental-mobile/releases'>Here</a>"
            }, {
                "title": "Github Repos",
                "content": "<h4>Golang web API</h4> <a href='https://github.com/remony/Equipment-Rental-API'>Repo Link</a><br><h4>AngularJS web app</h4> <a href='https://github.com/remony/equipment-rental-website'>Repo Link</a><br><h4>Ionic Mobile App</h4> <a href='https://github.com/remony/equipment-rental-mobile'>Repo Link</a>"
            }]
        };
    }]);
