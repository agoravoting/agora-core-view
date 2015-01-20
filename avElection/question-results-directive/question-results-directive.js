/**
 * Shows the results of a specific question in an election
 */
angular.module('avElection')
  .directive('avQuestionResults', function($state) {
    // works like a controller
    function link(scope, element, attrs) {
      var mappings = {
        "simple.plurality-at-large": "plurality-at-large",
        "pcandidates-election.pcandidates-election": "plurality-at-large"
      };

      var key = scope.question.layout + "." + scope.question.tally_type;
      if (scope.$parent.election.layout === "pcandidates-election") {
        $state.go("election.results.show." + mappings["pcandidates-election"]);
      } else if (key in mappings) {
        $state.go("election.results.show." + mappings[key]);
      } else {
        $state.go("election.results.show.unknown");
      }
      scope.question_index = attrs.index;
    }
    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avElection/question-results-directive/question-results-directive.html'
    };
  });
