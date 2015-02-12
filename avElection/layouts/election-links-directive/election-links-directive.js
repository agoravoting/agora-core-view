/**
 * Shows election links, highlighting the one selected
 */
angular.module('avElection')
  .directive('aveElectionLinks', function() {
    function link(scope, element, attrs) {
      scope.checkState = function (validStates) {
        return _.contains(validStates, scope.electionState);
      };
    }
    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avElection/layouts/election-links-directive/election-links-directive.html'
    };
  });
