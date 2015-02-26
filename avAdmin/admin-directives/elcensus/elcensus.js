angular.module('avAdmin')
  .directive('avAdminElcensus', function($window, $state, ElectionsApi, Authmethod, $modal, MustExtraFieldsService) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
      scope.census = ['open', 'close'];
      scope.election = ElectionsApi.currentElection;
      scope.newcensus = {};
      scope.massiveef = "";
      scope.loading = false;
      scope.error = null;
      scope.msg = null;
      scope.loadingcensus = !ElectionsApi.newElection;

      function addToCensus() {
          var el = scope.election;
          var cs = [];
          if (!el.id) {
            cs = el.census.voters;
            cs.push({selected: false, vote: false, username: "", metadata: scope.newcensus});
          } else {
            cs.push({selected: false, vote: false, username: "", metadata: scope.newcensus});

            var csExport = _.map(cs, function (i) { return i.metadata; });
            console.log("add to census");
            scope.loading = true;
            Authmethod.addCensus(el.id, csExport, 'disabled')
              .success(function(r) {
                scope.loading = false;
                scope.msg = "avAdmin.census.censusadd";
                  console.log("added to census");
              })
              .error(function(error) {
                scope.loading = false;
                scope.error = error.error;
                console.log("not added to census");
              });
          }
          scope.newcensus = {};
      }

      function delVoter(index) {
          var el = scope.election;
          var cs = el.census.voters;
          el.census.voters = cs.slice(0, index).concat(cs.slice(index+1,cs.length));
      }

      function massiveAdd() {
          var el = scope.election;
          var cs;
          if (!el.id) {
            cs = el.census.voters;
          } else {
            cs = [];
          }

          var fields = el.census.extra_fields;

          var lines = scope.massiveef.split("\n");
          lines.forEach(function(l) {
              var lf = l.split(";");
              var nv = {};
              fields.forEach(function(f, i) { nv[f.name] = lf[i]; });
              cs.push({selected: false, vote: false, username: "", metadata: nv});
          });

          if (!!el.id) {
            console.log("add to census");
            var csExport = _.map(cs, function (i) { return i.metadata; });
            scope.loading = true;
            Authmethod.addCensus(el.id, csExport, 'disabled')
              .success(function(r) {
                scope.loading = false;
                scope.msg = "avAdmin.census.censusadd";
                console.log("added to census");
              })
              .error(function(error) {
                scope.loading = false;
                scope.error = error.error;
                console.log("not added to census");
              });
          }

          scope.massiveef = "";
      }

      function exportCensus() {
        var el = scope.election;
        var cs = el.census.voters;
        var csExport = _.map(cs, function (i) {
          var ret = angular.copy(i.metadata);
          ret.vote = i.vote;
          return ret;
        });
        var text = $window.Papa.unparse(angular.toJson(csExport));
        var blob = new $window.Blob([text], {type: "text/csv"});
        $window.saveAs(blob, el.id + "-census"+".csv");
        return false;
      }

      function removeSelected() {
        var selectedList = _.filter(scope.election.census.voters, function (v) {
          return v.selected === true;
        });
        if (!scope.election.id) {
          _.each(selectedList, function (selected) {
            var i = scope.election.census.voters.indexOf(selected);
            delVoter(i);
          });
        } else {
          var user_ids = _.pluck(selectedList, "id");
          Authmethod.removeUsersIds(scope.election.id, scope.election, user_ids)
          .success(function(r) {
            scope.loading = false;
            scope.msg = "avAdmin.dashboard.removeusers";
          })
          .error(function(error) { scope.loading = false; scope.error = error.error; });
        }
        return false;
      }

      function sendAuthCodes(user_ids) {
        scope.loading = true;
        Authmethod.sendAuthCodes(scope.election.id, scope.election, user_ids)
          .success(function(r) {
            scope.loading = false;
            scope.msg = "avAdmin.dashboard.censussend";
          })
          .error(function(error) { scope.loading = false; scope.error = error.error; });
      }

      function sendAuthCodesSelected() {
        var selectedList = _.filter(scope.election.census.voters, function (v) {
          return v.selected === true;
        });
        var user_ids = _.pluck(selectedList, "id");
        $modal.open({
          templateUrl: "avAdmin/admin-directives/dashboard/send-auth-codes-modal.html",
          controller: "SendAuthCodesModal",
          size: 'lg',
          resolve: {
            election: function () { return scope.election; },
            user_ids: function() { return user_ids; }
          }
        }).result.then(sendAuthCodes);
        return false;
      }

      angular.extend(scope, {
        addToCensus: addToCensus,
        delVoter: delVoter,
        massiveAdd: massiveAdd,
        exportCensus: exportCensus,
        removeSelected: removeSelected,
        sendAuthCodesSelected: sendAuthCodesSelected,
        numSelected: function () {
          return _.filter(scope.election.census.voters, function (v) {
            return v.selected === true;
          }).length;
        }
      });

      function main() {
        scope.election = ElectionsApi.currentElection;
        MustExtraFieldsService(scope.election);

        if (!ElectionsApi.newElection) {
          ElectionsApi.getCensus(scope.election)
            .then(function(el) {
              _.each(el.census.voters, function(voter) {
                voter.selected = false;
              });
              scope.loadingcensus = false;
            })
            .catch(function(error) {
              // TODO show error
              console.log("error loading census");
              scope.loadingcensus = false;
            });
        }
      }

      ElectionsApi.waitForCurrent(main);
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-directives/elcensus/elcensus.html'
    };
  });
