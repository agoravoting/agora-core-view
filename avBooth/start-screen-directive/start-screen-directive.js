/*
 * Start screen directive.
 *
 * Shows the steps to the user.
 */
angular.module('avBooth')
  .directive('avStartScreen', function() {
    return {
      restrict: 'E',
      templateUrl: 'avBooth/start-screen-directive/start-screen-directive.html'
    };
  });