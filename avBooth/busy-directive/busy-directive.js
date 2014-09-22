angular.module('avBooth')
  .directive('avBusy', function($resource) {
    return {
      restrict: 'E',
      scope: {},
      transclude: true,
      templateUrl: 'avBooth/busy-directive/busy-directive.html'
    };
  });