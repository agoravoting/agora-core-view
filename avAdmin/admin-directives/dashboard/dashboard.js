angular.module('avAdmin')
  .directive('avAdminDashboard', ["ElectionsApi", "$stateParams", function(ElectionsApi, $stateParams) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        var id = $stateParams.id;
        scope.current = {};
        ElectionsApi.get_election(id, function(el) { scope.current = el; }, function(data) {});
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-directives/dashboard/dashboard.html'
    };
  }]);
