/**
 * Shows the results of an election
 */
angular.module('avElection')
  .directive('avResults', function(moment) {
    // works like a controller
    function link(scope, element, attrs) {

      /*
       * Parses and initializes the election data
       */
      function initData() {
        scope.last_updated = moment(scope.election.last_updated).format('lll');
        console.log("scope.last_updated = " + scope.last_updated);
      }
      initData();
    }
    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avElection/results-directive/results-directive.html'
    };
  });
