angular.module('avAdmin')
  .directive('avQuestions', function() {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        function newQuestion() {
            if (!scope.questions) {
                scope.questions = [];
            }

            var question = {};
            question.title = $("#text").val();

            // reset
            $("#text").val("");

            scope.questions.push(question);
            return false;
        }

        function rmQuestion(index) {
            scope.questions.splice(index, 1);
            return false;
        }

        function newOption() {
            if (!scope.options) {
                scope.options = [];
            }

            var option = {};
            option.text = $("#options").val();

            // reset
            $("#options").val("");

            scope.options.push(option);
            return false;
        }

        function rmOption(index) {
            scope.options.splice(index, 1);
            return false;
        }

        angular.extend(scope, {
          newQuestion: newQuestion,
          rmQuestion: rmQuestion,
          newOption: newOption,
          rmOption: rmOption,
        });
    }

    return {
      restrict: 'AE',
      scope: {
        questions: '=questions'
      },
      link: link,
      templateUrl: 'avAdmin/questions-directive/questions-directive.html'
    };
  });
