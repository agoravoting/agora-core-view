angular.module('avAdmin')
  .directive('avAdminDashboard', ["ElectionsApi", "$stateParams", function(ElectionsApi, $stateParams) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        var id = $stateParams.id;
        var statuses = [
            'registered',
            'created',
            'started',
            'stopped',
            'tally_ok',
            'results_ok'
        ];
        scope.statuses = statuses;
        scope.current = {};
        scope.index = 0;
        ElectionsApi.get_election(id,
            function(el) {
                scope.current = el;
                scope.index = statuses.indexOf(el.status) + 1;
            },
            function(data) {});
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-directives/dashboard/dashboard.html'
    };
  }]);
