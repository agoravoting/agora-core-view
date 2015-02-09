angular.module('avAdmin')
  .directive('avAdminHead', ['Authmethod', '$state', '$cookies', '$i18next', function(Authmethod, $state, $cookies, $i18next) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        var admin = $cookies.user;
        scope.admin = admin;
        scope.nologin = ('nologin' in attrs) || scope.admin;
        scope.deflang = navigator.language;

        scope.loginrequired = ('loginrequired' in attrs);
        if (scope.loginrequired && !scope.admin) {
            $state.go("registration.logout");
        }

        function changeLang(newl) {
            $i18next.options.lng = newl;
            scope.deflang = $i18next.options.lng;
        }

        angular.extend(scope, {
          changeLang: changeLang,
        });

        function ping() {
            Authmethod.ping()
                .success(function(data) {
                    if (data.logged) {
                        Authmethod.setAuth(data['auth-token']);
                        Authmethod.pingTimeout = setTimeout(function() { ping(); }, 5000);
                    } else {
                        $state.go("registration.logout");
                    }
                })
                .error(function(data) {
                    $state.go("registration.logout");
                });
        }

        // checking login status
        if (admin) {
            if (!Authmethod.pingTimeout) {
                ping();
            }
        }
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-head-directive/admin-head-directive.html'
    };
  }]);
