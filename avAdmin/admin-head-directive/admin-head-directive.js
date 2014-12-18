angular.module('avAdmin')
  .directive('avAdminHead', function() {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        // TODO make it real
        var admin = 'Ganemos Sevilla';
        scope.admin = admin;
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-head-directive/admin-head-directive.html'
    };
  });
