angular.module('avAdmin')
  .directive('avAdminHead', ['Authmethod', '$state', '$cookies', '$i18next', function(Authmethod, $state, $cookies, $i18next) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        var admin = $cookies.user;
        scope.admin = admin;
        scope.nologin = ('nologin' in attrs) || scope.admin;

        scope.loginrequired = ('loginrequired' in attrs);
        if (scope.loginrequired && !scope.admin) {
            $state.go("admin.logout");
        }

        function ping() {
            Authmethod.ping()
                .success(function(data) {
                    if (data.logged) {
                        $cookies.auth = data['auth-token'];
                        Authmethod.setAuth($cookies.auth, $cookies.isAdmin);
                        Authmethod.pingTimeout = setTimeout(function() { ping(); }, 60000);
                    } else {
                        $state.go("admin.logout");
                    }
                })
                .error(function(data) {
                    $state.go("admin.logout");
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
