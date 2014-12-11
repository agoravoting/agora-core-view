angular.module('avRegistration')
  .directive('avValidate', ['Authmethod', '$location', '$state', function(Authmethod, $location, $state) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {

        var splitUrl = $location.absUrl().split('/');
        var autheventid = splitUrl[splitUrl.length - 2];

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
        };

        scope.validate = function() {
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

