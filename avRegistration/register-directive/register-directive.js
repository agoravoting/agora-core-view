angular.module('avRegistration')
  .directive('avRegister', ['Authmethod', '$location', '$parse', '$state', function(Authmethod, $location, $parse, $state) {
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
            scope.fields = JSON.parse(authevent['metadata']);
        };

        scope.signUp = function(valid) {
            if (!valid) {
                return;
            }
            Authmethod.signup(scope.method, autheventid, scope.register)
                .success(function(data) {
                    if (data.status === "ok") {
                        scope.user = data.user;
                        // TODO neccesary validation?
                        $state.go('registration.validate', {id: autheventid});
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
