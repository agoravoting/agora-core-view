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
      } if (scope.$parent.election.layout === "pcandidates-election") {
        $state.go("election.results.show." + supportedLayouts["pcandidates-election"]);
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
