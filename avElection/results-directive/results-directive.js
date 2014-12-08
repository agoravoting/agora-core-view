angular.module('avElection')
  .directive('avResults', function() {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
    }
    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avElection/results-directive/results-directive.html'
    };
  });
