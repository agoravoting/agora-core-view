angular.module('avAdmin')
  .directive('avAdminHead', ['$cookies', function($cookies) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        // TODO make it real
        var admin = $cookies.user;
        scope.admin = admin;
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-head-directive/admin-head-directive.html'
    };
  }]);
