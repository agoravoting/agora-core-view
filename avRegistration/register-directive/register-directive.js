angular.module('avRegistration')
  .directive('avRegister', function(Authmethod, $parse, $state, $cookies, $i18next) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        var autheventid = attrs.eventId;
        scope.register = {};

        scope.email = null;
        if (attrs.email && attrs.email.length > 0) {
          scope.email = attrs.email;
        }

        scope.signUp = function(valid) {
            if (!valid) {
                return;
            }
            var data = {
                'auth-method': scope.method,
                'authevent': autheventid,
            };
            _.each(scope.register_fields, function (field) {
              data[field.name] = field.value;
              if (field.name === 'email') {
                scope.email = field.value;
              }
            });
            Authmethod.signup(data)
                .success(function(rcvData) {
                    if (rcvData.status === "ok") {
                        scope.user = rcvData.user;
                        $state.go('registration.login', {id: autheventid});
                    } else {
                        scope.status = 'Not found';
                        scope.error = $i18next('avRegistration.invalidRegisterData');
                    }
                })
                .error(function(error) {
                    scope.status = 'Registration error: ' + error.message;
                    scope.error = $i18next('avRegistration.invalidRegisterData');
                });
        };

        scope.apply = function(authevent) {
            scope.method = authevent['auth_method'];
            scope.name = authevent['name'];
            scope.register_fields = Authmethod.getRegisterFields(authevent);
            var fields = _.map(
              scope.register_fields,
              function (el) {
                el.value = null;
                el.disabled = false;
                if (el.type === "email" && scope.email !== null) {
                  el.value = scope.email;
                  el.disabled = true;
                }
                return el;
              });
            var filled_fields = _.filter(fields,
              function (el) { return el.value !== null; });

            if (filled_fields.length !== scope.register_fields.length) {
              return;
            }
            scope.signUp(true);
        };

        scope.view = function(id) {
            Authmethod.viewEvent(id)
                .success(function(data) {
                    if (data.status === "ok") {
                        scope.apply(data.events);
                    } else {
                        scope.status = 'Not found';
                        document.querySelector(".input-error").style.display = "block";
                    }
                })
                .error(function(error) {
                    scope.status = 'Scan error: ' + error.message;
                    document.querySelector(".input-error").style.display = "block";
                });
        };

        scope.view(autheventid);
    }

    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avRegistration/register-directive/register-directive.html'
    };
  });
