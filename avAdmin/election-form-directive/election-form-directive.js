angular.module('avAdmin')
  .directive('avElectionForm', function() {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        if (!scope.election) {
            scope.election = {questions: []};
        }

        function saveElection() {
            var el = scope.election;
            console.log("SAVING:");

            // validating election
            el.errors = [];
            if (!el.title) {
                el.errors.push(window.i18n.t("avAdmin.form.el.titleError"));
            }
            if (!el.description) {
                el.errors.push(window.i18n.t("avAdmin.form.el.descriptionError"));
            }
            if (!el.questions || el.questions.length === 0) {
                el.errors.push(window.i18n.t("avAdmin.form.el.questionsError"));
            }

            if (el.errors.length === 0) {
                // DONE
            }

            console.log(el);
        }

        angular.extend(scope, {
          saveElection: saveElection,
        });
    }

    return {
      restrict: 'AE',
      scope: {
        election: '=election'
      },
      link: link,
      templateUrl: 'avAdmin/election-form-directive/election-form-directive.html'
    };
  });
