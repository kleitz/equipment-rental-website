'use strict';

// Change this to your main domain
var domain = 'https://karite.xyz';
// var domain = 'http://localhost:3000';

/*

            Do not edit below

 */

var api = '/api';
var data = '/data';

var backend = domain + api;
var dataURI = domain + data;

angular.module('app.config', [])
.factory('Configuration', function() {
    return {
        backend: backend,
        domainURI: domain,
        dataURI: dataURI,
        domain: domain
    };
});
