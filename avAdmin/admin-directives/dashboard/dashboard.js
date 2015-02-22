angular.module('avAdmin')
  .directive('avAdminDashboard', function($state, Authmethod, ElectionsApi, $stateParams, $modal) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
      var id = $stateParams.id;

      if (!id) {
        $state.go("admin.basic");
      }

      var statuses = [
        'registered',
        'created',
        'started',
        'stopped',
        'results_ok',
        'results_pub'
      ];

      var nextactions = [
        'avAdmin.dashboard.create',
        'avAdmin.dashboard.start',
        'avAdmin.dashboard.stop',
        'avAdmin.dashboard.tally',
        'avAdmin.dashboard.publish'
      ];


      var commands = [
        {path: 'register', method: 'GET'},
        {
          path: 'create',
          method: 'POST',
          confirmController: "ConfirmCreateModal",
          confirmTemplateUrl: "avAdmin/admin-directives/dashboard/confirm-create-modal.html"
        },
        {
          path: 'start',
          method: 'POST',
          confirmController: "ConfirmStartModal",
          confirmTemplateUrl: "avAdmin/admin-directives/dashboard/confirm-start-modal.html"
        },
        {
          path: 'stop',
          method: 'POST',
          confirmController: "ConfirmStopModal",
          confirmTemplateUrl: "avAdmin/admin-directives/dashboard/confirm-stop-modal.html"
        },
        {
          path: 'tally',
          method: 'POST',
          confirmController: "ConfirmTallyModal",
          confirmTemplateUrl: "avAdmin/admin-directives/dashboard/confirm-tally-modal.html"
        },
        {
          path: 'publish-results',
          method: 'POST',
          confirmController: "ConfirmPublishResultsModal",
          confirmTemplateUrl: "avAdmin/admin-directives/dashboard/confirm-publish-results-modal.html"
        }
      ];

      scope.statuses = statuses;
      scope.election = {};
      scope.index = 0;
      scope.nextaction = 0;
      scope.loading = true;
      scope.waiting = false;
      scope.error = null;
      scope.msg = null;
      scope.prevStatus = null;

      ElectionsApi.getElection(id)
        .then(function(el) {
          scope.loading = false;
          scope.election = el;
          scope.intally = el.status === 'doing_tally';
          if (scope.intally) {
            scope.index = statuses.indexOf('stopped') + 1;
            scope.nextaction = false;
          } else {
            scope.index = statuses.indexOf(el.status) + 1;
            scope.nextaction = nextactions[scope.index - 1];
          }

          if (el.status === 'results_ok') {
            ElectionsApi.results(el);
          } else if (el.status === 'tally_ok') {
            // auto launch calculate
            calculateResults(el);
          }

          ElectionsApi.autoreloadStats(el);
        });

      function reload() {
        scope.loading = true;
        scope.prevStatus = scope.election.status;
        scope.waiting = true;
        setTimeout(waitElectionChange, 1000);
      }

      function waitElectionChange() {
        var ignorecache = true;
        ElectionsApi.getElection(id, ignorecache)
          .then(function(el) {
            if (el.status === scope.prevStatus && scope.waiting) {
              setTimeout(waitElectionChange, 1000);
            } else {
              scope.waiting = false;
              scope.loading = false;
              scope.prevStatus = null;
              scope.election = el;

              scope.intally = el.status === 'doing_tally';
              if (scope.intally) {
                scope.index = statuses.indexOf('stopped') + 1;
                scope.nextaction = false;
                scope.prevStatus = scope.election.status;
                scope.waiting = true;
                waitElectionChange();
              } else {
                scope.index = statuses.indexOf(el.status) + 1;
                scope.nextaction = nextactions[scope.index - 1];
                // auto launch calculate
                if (el.status === 'tally_ok') {
                  calculateResults(el);
                }

                if (el.status === 'results_ok') {
                  ElectionsApi.results(el);
                }
              }
            }
          });
      }

      function doActionConfirm(index) {
        if (scope.intally) {
          return;
        }
        var command = commands[index];
        if (!angular.isDefined(command.confirmController)) {
          doAction(index);
          return;
        }

        $modal.open({
          templateUrl: command.confirmTemplateUrl,
          controller: command.confirmController,
          size: 'lg'
        }).result.then(function () {
          doAction(index);
        });
      }

      function doAction(index) {
        if (scope.intally) {
          return;
        }
        scope.loading = true;
        scope.prevStatus = scope.election.status;
        scope.waiting = true;
        setTimeout(waitElectionChange, 1000);

        var c = commands[index];
        ElectionsApi.command(scope.election, c.path, c.method, c.data)
          .catch(function(error) { scope.loading = false; scope.error = error; });

        if (c.path === 'start') {
          Authmethod.changeAuthEvent(scope.election.id, 'started')
            .error(function(error) { scope.loading = false; scope.error = error; });
        }

        if (c.path === 'stop') {
          Authmethod.changeAuthEvent(scope.election.id, 'stopped')
            .error(function(error) { scope.loading = false; scope.error = error; });
        }
      }

      function calculateResults(el) {
          if (el.status !== 'tally_ok') {
            return;
          }

          scope.loading = true;
          scope.prevStatus = 'tally_ok';
          scope.waiting = true;
          setTimeout(waitElectionChange, 1000);

          var path = 'calculate-results';
          var method = 'POST';
          // TODO add config to calculate results
          var data = [ [ "agora_results.pipes.results.do_tallies", {"ignore_invalid_votes": true} ] ];
          ElectionsApi.command(el, path, method, data)
            .catch(function(error) { scope.loading = false; scope.error = error; });
      }

      function sendAuthCodes(election) {
        scope.loading = true;
        Authmethod.sendAuthCodes(election.id)
          .success(function(r) {
            scope.loading = false;
            scope.msg = "avAdmin.dashboard.censussend";
          })
          .error(function(error) { scope.loading = false; scope.error = error.error; });
      }

      angular.extend(scope, {
        doAction: doAction,
        doActionConfirm: doActionConfirm,
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
  });
