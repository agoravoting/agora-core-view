angular.module('avAdmin')
  .directive('avAdminHead', ['$cookies', '$i18next', function($cookies, $i18next) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        var admin = $cookies.user;
        scope.admin = admin;
        scope.nologin = ('nologin' in attrs) || scope.admin;
        scope.deflang = navigator.language;

        function changeLang(newl) {
            $i18next.options.lng = newl;
            scope.deflang = $i18next.options.lng;
        }

        angular.extend(scope, {
          changeLang: changeLang,
        });
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-head-directive/admin-head-directive.html'
    };
  }]);
