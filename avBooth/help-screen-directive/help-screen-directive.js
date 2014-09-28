/*
 * Help screen directive.
 *
 * Shows the contact data.
 */
angular.module('avBooth')
  .directive('avbHelpScreen', function() {
    return {
      restrict: 'E',
      templateUrl: 'avBooth/help-screen-directive/help-screen-directive.html'
    };
  });
