angular.module('avAdmin')
  .directive('avElectionForm', ['Authmethod', 'ElectionsApi', 'AuthApi', '$state', function(Authmethod, ElectionsApi, AuthApi, $state) {
    function link(scope, element, attrs) {
        scope.newElection = false;

        if (!scope.election) {
            scope.election = {questions: []};
        }

        scope.createToken = null;
        scope.editToken = null;

        if (!scope.election.id) {
            scope.newElection = true;
            AuthApi.getPerm("admin", "election", 0)
                .success(function(data) {
                    scope.createToken = data['permission-token'];
                })
                .error(function(data) {
                    // TODO show this error
                    console.log(data);
                });
        } else {
            AuthApi.getPerm("admin", "election", scope.election.id)
                .success(function(data) {
                    scope.editToken = data['permission-token'];
                })
                .error(function(data) {
                    // TODO show this error
                    console.log(data);
                });
        }

        function callError(error) {
            scope.status = 'Error: ' + error.message;
            document.querySelector(".error").style.display = "block";
            scope.loading = false;
        }

        function createAuthEvent(el, success) {
            var data = {
                'name': el.title,
                'auth_method': 'email', // TODO select method
            };

            Authmethod.createEvent(data)
                .success(function(data) {
                    if (data.status === "ok") {
                        scope.election.id = data.id;
                        el.id = data.id;
                        scope.editToken = data.perm;
                        success();
                    } else {
                        scope.status = 'Not found';
                        document.querySelector(".error").style.display = "block";
                        scope.loading = false;
                    }
                })
                .error(callError);
        }

        function createElection(el) {
            if (scope.newElection) {
                ElectionsApi.createElection(el, scope.createToken, scope.editToken,
                    function(data) {
                        $state.go("admin.elections");
                    },
                    callError);
            }
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
                scope.loading = true;
                createAuthEvent(el,
                    // then we create the election
                    function() { createElection(el); });
            }
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
