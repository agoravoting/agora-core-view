angular.module('avAdmin')
  .directive('avAdminElcensus', ['$state', 'ElectionsApi', function($state, ElectionsApi) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        scope.census = ['open', 'closed'];
        scope.election = ElectionsApi.currentElection;
        scope.newef = {};
        scope.newcensus = {};

        function saveCensus() {
            $state.go("admin.auth");
        }

        function delEf(index) {
            var el = ElectionsApi.currentElection;
            var ef = el.census.extra_fields;
            el.census.extra_fields = ef.slice(0, index).concat(ef.slice(index+1,ef.length));
        }

        function addEf() {
            var el = ElectionsApi.currentElection;
            var efs = el.census.extra_fields;

            var ef = {
                name: scope.newef.name,
                type: "text",
                required: scope.newef.required,
                min: 2,
                max: 200,
                required_on_authentication: true
            };

            scope.newef = {};
            efs.push(ef);
        }

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

        angular.extend(scope, {
            saveCensus: saveCensus,
            delEf: delEf,
            addEf: addEf,
            addToCensus: addToCensus,
            delVoter: delVoter,
        });
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-directives/elcensus/elcensus.html'
    };
  }]);
