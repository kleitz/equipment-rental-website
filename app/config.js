'use strict';

 //var domain = 'http://192.168.1.99:3000'
// var domain = 'http://localhost:3000'
 var domain = 'http://localhost:3000'
//var domain = 'https://karite.xyz';
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
