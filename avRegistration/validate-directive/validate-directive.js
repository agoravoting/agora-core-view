angular.module('avRegistration')
  .directive('avValidate', ['Authmethod', 'Patterns', '$location', '$state', function(Authmethod, Patterns, $location, $state) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {

        var splitUrl = $location.absUrl().split('/');
        var autheventid = splitUrl[splitUrl.length - 2];
        scope.validate = {};

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
            scope.metadata = JSON.parse(authevent['metadata']);
            var validateStep = scope.metadata.fieldsValidate;
            if (typeof validateStep === 'string') {
                $state.go('registration.success');
            }
        };

        scope.patterns = function(name) {
            return Patterns.get(name);
        };

        scope.validate = function(valid) {
            if (!valid) {
                return;
            }
            var data = {
                'tlf': scope.tlf,
                'dni': scope.dni,
                'code': scope.code,
            };
            Authmethod.validate(scope.method, autheventid, data)
                .success(function(data) {
                    if (data.status === "ok") {
                        $state.go('registration.success');
                    } else {
                        // TODO: msg try again
                        scope.status = 'Not found';
                        document.querySelector(".error").style.display = "block";
                    }
                })
                .error(function(error) {
                    scope.status = 'Scan error: ' + error.message;
                    document.querySelector(".error").style.display = "block";
                });
        };
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avRegistration/validate-directive/validate-directive.html'
    };
  }]);

