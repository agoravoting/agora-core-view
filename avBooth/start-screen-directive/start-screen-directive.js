/*
 * Start screen directive.
 *
 * Shows the steps to the user.
 */
angular.module('avBooth')
  .directive('avStartScreen', function() {    
    function link(scope, element, attrs) {
      scope.isCollapsed = false;
    }    
    return {
      restrict: 'E',
      link: link,
      templateUrl: 'avBooth/start-screen-directive/start-screen-directive.html'
    };
  });