angular.module('avAdmin')
  .directive('avAdminFoot', function() {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-foot-directive/admin-foot-directive.html'
    };
  });
