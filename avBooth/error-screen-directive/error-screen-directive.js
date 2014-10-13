/*
 * Error indicator directive.
 */
angular.module('avBooth')
  .directive('avbErrorScreen', function($resource, $window) {
    return {
      restrict: 'AE',
      templateUrl: 'avBooth/error-screen-directive/error-screen-directive.html'
    };
  });
