/**
 * Shows the results of an election in a simple way
 */
angular.module('avElection')
  .directive('aveDefaultElection', function() {
    function link(scope, element, attrs) {
    }
    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avElection/layouts/default-election-directive/default-election-directive.html'
    };
  });
