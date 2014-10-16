/*
 * Error indicator directive.
 */
angular.module('avBooth')
  .directive('avbErrorScreen', function($resource, $window) {

    function link(scope, element, attrs) {
      scope.errorId = scope.authorizationHeader.split('-')[2].substr(0, 6);
    }
    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avBooth/error-screen-directive/error-screen-directive.html'
    };
  });
