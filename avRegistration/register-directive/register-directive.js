angular.module('avRegistration')
  .directive('avRegister', ['Authmethod', 'Patterns', '$location', '$parse', '$state', function(Authmethod, Patterns, $location, $parse, $state) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        var splitUrl = $location.absUrl().split('/');
        var autheventid = splitUrl[splitUrl.length - 2];
        scope.register = {};

        scope.view = function(id) {
            Authmethod.viewEvent(id)
                .success(function(data) {
                    if (data.status === "ok") {
                        scope.apply(data.events);
                    } else {
                        scope.status = 'Not found';
                        document.querySelector(".error").style.display = "block";
                    }
                })
                .error(function(error) {
                    scope.status = 'Scan error: ' + error.message;
                    document.querySelector(".error").style.display = "block";
                });
        };
        scope.view(autheventid);

        scope.apply = function(authevent) {
            scope.method = authevent['auth_method'];
            scope.name = authevent['name'];
            scope.metadata = authevent['metadata'];
            if (scope.metadata.steps[0] === 'validate') {
                $state.go('registration.validate', {id: autheventid});
            } else if (scope.metadata.steps[0] === 'login') {
                $state.go('registration.login', {id: autheventid});
            }
        };

        scope.patterns = function(name) {
            return Patterns.get(name);
        };

        scope.signUp = function(valid) {
            if (!valid) {
                return;
            }
            Authmethod.signup(scope.method, autheventid, scope.register)
                .success(function(data) {
                    if (data.status === "ok") {
                        scope.user = data.user;
                        if (scope.metadata.steps.indexOf('validate') > -1) {
                            $state.go('registration.validate', {id: autheventid});
                        } else if (scope.metadata.steps.indexOf('login') > -1) {
                            $state.go('registration.success');
                        }
                    } else {
                        scope.status = 'Not found';
                        document.querySelector(".error").style.display = "block";
                    }
                })
                .error(function(error) {
                    scope.status = 'Registration error: ' + error.message;
                    document.querySelector(".error").style.display = "block";
                });
        };
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avRegistration/register-directive/register-directive.html'
    };
  }]);
