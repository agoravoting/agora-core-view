/**
 * Shows the results of a specific question in an election
 */
angular.module('avElection')
  .directive('avQuestionResults', function($state) {
    // works like a controller
    function link(scope, element, attrs) {
      var mappings = {
        "simple.plurality-at-large": "plurality-at-large",
        "simple.borda-nauru": "plurality-at-large",
        "simple.borda": "plurality-at-large",
        "circles.plurality-at-large": "plurality-at-large",
        "circles.borda": "plurality-at-large",
        "circles.borda-nauru": "plurality-at-large",
        "details.plurality-at-large": "plurality-at-large",
        "details.borda": "plurality-at-large",
        "details.borda-nauru": "plurality-at-large"
      };

      var key = scope.question.layout + "." + scope.question.tally_type;
      if (key in mappings) {
        $state.go(scope.statePrefix + "." + mappings[key]);
      } else {
        $state.go(scope.statePrefix + ".unknown");
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
