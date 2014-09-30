/*
 * Help screen directive.
 */
angular.module('avBooth')
  .directive('avbHelpScreen', function(ConfigService) {

    function link(scope, element, attrs) {
        scope.helpInfo = ConfigService.help.info;
    }

    return {
      restrict: 'E',
      link: link,
      templateUrl: 'avBooth/help-screen-directive/help-screen-directive.html'
    };
  });
