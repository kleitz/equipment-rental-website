'use strict';

angular.module('app.qrcode', ['app.config'])
  .directive('qrcode', function() {
    return {
      restrict: 'AEC',
      scope: {
        source: '@',
        width: '=',
        height: '=',
        type: '='
      },
      templateUrl: 'components/qrcode/qrcode.html',
      controller: function($scope, $http, $rootScope, $location, $attrs) {


        $scope.$watch(
          "source",
          function handler() {
            if ($attrs.source != "{{product}}" && $attrs.source != 'undefined' && $attrs.source != '') {
              var value = JSON.parse($attrs.source);
              $scope.showLoading = false;

              if ($attrs.height === undefined) {
                $attrs.height = 600;
              }
              if ($attrs.width === undefined) {
                $attrs.width = 600;
              }

              if (value.id !== undefined) {
                $http({
                  url: backend + '/identify/qr/' + $attrs.type,
                  method: 'GET',
                  headers: {
                    'code': value.id,
                    'height': $attrs.height,
                    'width': $attrs.width
                  }
                }).success(function(data) {
                  console.log('got reponse')
                  setTimeout(function() {
                    $scope.qr = data;
                    $scope.$apply();
                  });
                }).error(function() {
                  $scope.error = true;
                });
              }

            } else {
              $scope.showLoading = true;
            }
          }
        );
      }
    };
  });
