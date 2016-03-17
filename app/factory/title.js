/**
 * Created by remon on 17/03/2016.
 */
angular.module('app.titleFactory', [])
.factory('Title', function($rootScope) {
    var title = 'default';
    return {
        title: function() {
            setTimeout(function() {
                $rootScope.title = title;
                $rootScope.$apply();
            }, 0) },
        setTitle: function(newTitle) { title = newTitle; this.title() }
    };
});