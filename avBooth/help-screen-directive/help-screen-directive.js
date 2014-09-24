/*
 * Start screen directive.
 *
 * Shows the steps to the user.
 */
angular.module('avBooth')
  .directive('avHelpScreen', function() {  
    return {
      restrict: 'E',
      templateUrl: 'avBooth/help-screen-directive/help-screen-directive.html'
    };
  });