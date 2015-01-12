angular.module('avAdmin')
  .directive('avElectionForm', ['Authmethod', '$cookies', function(Authmethod, $cookies) {
    function link(scope, element, attrs) {
        if (!scope.election) {
            scope.election = {questions: []};
        }

        function saveElection() {
            var el = scope.election;

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
                var data = {
                    'name': scope.el.title,
                    'auth_method': 'email', // TODO select method
                    'auth-token': $cookies.auth
                };
                Authmethod.createEvent(data)
                    .success(function(data) {
                        if (data.status === "ok") {
                            console.log("OK");
                            // TODO change other pg
                        } else {
                            scope.status = 'Not found';
                            document.querySelector(".error").style.display = "block";
                        }
                    })
                    .error(function(error) {
                        scope.status = 'Registration error: ' + error.message;
                        document.querySelector(".error").style.display = "block";
                    });

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
  }]);
