angular.module('avAdmin')
  .directive('avQuestion', function() {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        function newOption() {
            if (!scope.question.answers) {
                scope.question.answers = [];
            }

            var option = {};
            option.text = $(".newopt:visible").val();

            // reset
            $(".newopt:visible").val("");

            scope.question.answers.push(option);
            return false;
        }

        function rmOption(index) {
            scope.question.answers.splice(index, 1);
            return false;
        }

        function add(field, inc) {
            var value = scope.question[field];
            scope.question[field] = parseInt(value, 10) || 0;
            scope.question[field] += inc;
            value = scope.question[field];
            if (value < 0) {
                scope.question[field] = 0;
            }
        }

        angular.extend(scope, {
          newOption: newOption,
          rmOption: rmOption,
          add: add,
        });
    }

    return {
      restrict: 'AE',
      scope: {
        question: '=question'
      },
      link: link,
      templateUrl: 'avAdmin/question-directive/question-directive.html'
    };
  });
