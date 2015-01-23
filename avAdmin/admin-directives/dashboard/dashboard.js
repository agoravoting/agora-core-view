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

        var nextactions = [
            'avAdmin.dashboard.create',
            'avAdmin.dashboard.start',
            'avAdmin.dashboard.stop',
            'avAdmin.dashboard.tally',
            'avAdmin.dashboard.publish'
        ];

        scope.statuses = statuses;
        scope.election = {};
        scope.index = 0;
        scope.nextaction = 0;
        ElectionsApi.get_election(id,
            function(el) {
                scope.election = el;
                scope.index = statuses.indexOf(el.status) + 1;
                scope.nextaction = nextactions[scope.index - 1];
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
