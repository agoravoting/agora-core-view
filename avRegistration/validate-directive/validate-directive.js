angular.module('avRegistration')
  .directive('avValidate', ['Authmethod', '$location', function(Authmethod, $location) {
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
            Authmethod.validate(scope.method, scope.tlf, scope.code)
                .success(function(data) {
                    if (data.status === "ok") {
                        $location.path('validate/success');
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

