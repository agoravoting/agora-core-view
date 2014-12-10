/**
 * Shows the results of a specific question in an election
 */
angular.module('avElection')
  .directive('avQuestionResults', function($state) {
    // works like a controller
    function link(scope, element, attrs) {
      var supportedLayouts = {
        "plurality-at-large": "plurality-at-large",
        "pcandidates-election": "plurality-at-large"
      };
      if (scope.question.layout in supportedLayouts) {
        $state.go("election.results.show." + supportedLayouts[scope.question.layout]);
      } else {
        $state.go("election.results.show.unknown");
      }
    }
    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avElection/question-results-directive/question-results-directive.html'
    };
  });
