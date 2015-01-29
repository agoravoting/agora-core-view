angular.module('avAdmin')
  .directive('avAdminDashboard', ["AuthApi", "ElectionsApi", "$stateParams", function(AuthApi, ElectionsApi, $stateParams) {
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

        ElectionsApi.getElection(id)
            .then(function(el) {
                scope.election = el;
                scope.index = statuses.indexOf(el.status) + 1;
                scope.nextaction = nextactions[scope.index - 1];
            });

        function doAction(index) {
            // TODO Show the loading spinner and add a setinterval to
            // reload the election until the status change

            var commands = [
                {path: 'register', method: 'GET'},
                {path: 'create', method: 'POST'},
                {path: 'start', method: 'POST'},
                {path: 'stop', method: 'POST'},
                {path: 'tally', method: 'POST'},
                // TODO add config to calculate results
                {path: 'calculate-results', method: 'POST', data: [
                    [
                        "agora_results.pipes.results.do_tallies",
                        {"ignore_invalid_votes": true}
                    ]
                ]},
            ];
            var c = commands[index];
            ElectionsApi.command(scope.election, c.path, c.method, c.data)
                .then(function(d) {
                        console.log("OKS");
                      });

            if (c.path === 'start') {
                AuthApi.changeAuthEvent(scope.election.id, 'started');
            }

            if (c.path === 'stop') {
                AuthApi.changeAuthEvent(scope.election.id, 'stopped');
            }
        }

        function sendAuthCodes(election) {
            AuthApi.sendAuthCodes(election.id);
        }

        angular.extend(scope, {
          doAction: doAction,
          sendAuthCodes: sendAuthCodes,
        });
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-directives/dashboard/dashboard.html'
    };
  }]);
