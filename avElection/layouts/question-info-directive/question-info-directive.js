angular.module('avElection')
  .directive('aveQuestionInfo', function($state) {
    function link(scope, element, attrs) {
      var mappings = {
        "simple.plurality-at-large": "simple",
        "simple.borda-nauru": "simple",
        "pcandidates-election.pcandidates-election": "simple"
      };

      scope.question_index = attrs.index;
      if (scope.question.layout === "") {
        scope.question.layout = "simple";
      }
      var key = scope.question.layout + "." + scope.question.tally_type;
      if (key in mappings) {
        $state.go("election.public.show." + mappings[key]);
      } else {
        $state.go("election.public.show.simple");
      }
    }
    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avElection/layouts/question-info-directive/question-info-directive.html'
    };
  });



