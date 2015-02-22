angular.module('avAdmin')
  .directive('avAdminElcensus', function($window, $state, ElectionsApi) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
      scope.census = ['open', 'close'];
      scope.election = ElectionsApi.currentElection;
      scope.newcensus = {};
      scope.extra_fields = {editing: null};
      scope.massiveef = "";
      scope.loadingcensus = !ElectionsApi.newElection;

      function addToCensus() {
          var el = ElectionsApi.currentElection;
          var cs = el.census.voters;
          cs.push(scope.newcensus);
          scope.newcensus = {};
      }

      function delVoter(index) {
          var el = ElectionsApi.currentElection;
          var cs = el.census.voters;
          el.census.voters = cs.slice(0, index).concat(cs.slice(index+1,cs.length));
      }

      function massiveAdd() {
          var el = ElectionsApi.currentElection;
          var cs = el.census.voters;

          var fields = el.census.extra_fields;

          var lines = scope.massiveef.split("\n");
          lines.forEach(function(l) {
              var lf = l.split(";");
              var nv = {};
              fields.forEach(function(f, i) { nv[f.name] = lf[i]; });
              cs.push(nv);
          });

          scope.massiveef = "";
      }

      function exportCensus() {
        var el = ElectionsApi.currentElection;
        var cs = el.census.voters;
        var text = $window.Papa.unparse(angular.toJson(cs));
        var blob = new $window.Blob([text], {type: "text/csv"});
        $window.saveAs(blob, el.id + "-census"+".csv");
        return false;
      }

      angular.extend(scope, {
        addToCensus: addToCensus,
        delVoter: delVoter,
        massiveAdd: massiveAdd,
        exportCensus: exportCensus
      });

      function main() {
        scope.election = ElectionsApi.currentElection;

        if (!ElectionsApi.newElection) {
          ElectionsApi.getCensus(scope.election)
            .then(function(el) {
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
