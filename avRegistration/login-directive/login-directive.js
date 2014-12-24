angular.module('avRegistration')
  .directive('avLogin', ['Authmethod', '$location', '$parse', '$state', '$cookies', function(Authmethod, $location, $parse, $state, $cookies) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        var splitUrl = $location.absUrl().split('/');
        var autheventid = splitUrl[splitUrl.length - 2];

        scope.isAdmin = false;
        if (autheventid === 'admin') {
            scope.isAdmin = true;
        }

        scope.login = {};

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
        if (!scope.isAdmin) {
            scope.view(autheventid);
        }

        scope.apply = function(authevent) {
            scope.method = authevent['auth_method'];
            scope.name = authevent['name'];
        };

        scope.patterns = function(name) {
            if (name === 'mail' || name === 'email') {
                return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            } else {
                return /.*/;
            }
        };

        scope.loginUser = function(valid) {
            if (!valid) {
                return;
            }
            var data = {
                'auth-method': scope.method,
                'auth-data': {
                    'email': scope.login.email,
                    'password': scope.login.password,
                }
            };
            Authmethod.login(data)
                .success(function(data) {
                    if (data.status === "ok") {
                        scope.khmac = data.khmac;
                        $cookies.authevent = autheventid;
                        $cookies.userid = data['username'];
                        $cookies.user = scope.login.email;
                        $cookies.auth = data['auth-token'];
                        Authmethod.setAuth($cookies.auth);
                        if (scope.isAdmin) {
                            $state.go('admin.elections');
                        } else {
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

        scope.goSignup = function() {
            $state.go('registration.register', {id: autheventid});
        };

        scope.forgotPassword = function() {
            console.log('forgotPassword');
        };
    }
    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avRegistration/login-directive/login-directive.html'
    };
  }]);
