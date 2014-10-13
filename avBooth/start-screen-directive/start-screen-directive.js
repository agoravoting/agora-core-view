/*
 * Start screen directive.
 *
 * Shows the steps to the user.
 */
angular.module('avBooth')
  .directive('avbStartScreen', function() {
    return {
      restrict: 'AE',
      scope: true,
      templateUrl: 'avBooth/start-screen-directive/start-screen-directive.html'
    };
  });