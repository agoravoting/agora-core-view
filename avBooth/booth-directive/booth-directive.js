angular.module('avBooth')
  .directive('avBooth', function() {
    return {
      restrict: 'E',
      scope: {
        electionUrl: "@electionUrl"
      },
      templateUrl: 'avBooth/booth-directive/booth-directive.html'
    };
  });