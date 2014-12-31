angular.module('avAdmin')
  .directive('avQuestions', function() {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        scope.newquestion = {max: 1, min: 0};

        function hideAll() {
            $(".qshort").show();
            $(".qform").hide();
            return false;
        }

        function hideNewQuestion() {
            hideAll();
            $("#nq").hide();
            $("#newq").show();
            return false;
        }

        function newQuestion() {
            hideAll();
            $("#nq").show();
            $("#nq .qtext").focus();
            $("#newq").hide();
            return false;
        }

        function saveQuestion(index) {
            if (!scope.questions) {
                scope.questions = [];
            }

            var question = scope.newquestion;
            if (index !== undefined) {
                question = scope.questions[index];
            }

            // validating question
            question.errors = [];
            if (!question.title) {
                question.errors.push(window.i18n.t("avAdmin.form.q.titleError"));
            }
            if (!question.answers || question.answers.length === 0) {
                question.errors.push(window.i18n.t("avAdmin.form.q.optionsError"));
            }

            var min = parseInt(question.min, 10);
            var max = parseInt(question.max, 10);
            if (!(min >= 0 && max >= 0 && min <= max)) {
                question.errors.push(window.i18n.t("avAdmin.form.q.minmaxError"));
            }

            if (question.errors.length === 0) {
                if (index === undefined) {
                    scope.questions.push(scope.newquestion);
                    scope.newquestion = {max: 1, min: 0};
                }
                hideNewQuestion();
                hideAll();
            }

            return false;
        }

        function rmQuestion(index) {
            scope.questions.splice(index, 1);
            return false;
        }

        function showQuestion(index) {
            hideAll();
            hideNewQuestion();
            $("#newq").hide();

            $("#s"+index).hide();
            $("#q"+index).removeClass("hidden");
            $("#q"+index).show();
            $("#q"+index+" .qtext").focus();
        }

        angular.extend(scope, {
          saveQuestion: saveQuestion,
          newQuestion: newQuestion,
          rmQuestion: rmQuestion,
          showQuestion: showQuestion,
        });

        $("#nq").hide();
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
