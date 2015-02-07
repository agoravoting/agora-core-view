angular.module('avAdmin')
  .directive('avAdminElcensus', ['$state', 'ElectionsApi', function($state, ElectionsApi) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        scope.census = ['open', 'closed'];
        scope.election = ElectionsApi.currentElection;
        scope.newef = {};
        scope.newcensus = {};
        scope.massiveef = "";

        function must_extra_fields() {
            var el = ElectionsApi.currentElection;
            var ef = el.census.extra_fields;

            var name = 'email';
            var must = {};

            if (el.census.auth_method === 'email') {
                name = 'email';
                must = {
                    "must": true,
                    "name": "email",
                    "type": "text",
                    "required": true,
                    "min": 2,
                    "max": 200,
                    "required_on_authentication": true
                };
            } else if (el.census.auth_method === 'sms') {
                name = 'tlf';
                must = {
                    "must": true,
                    "name": "tlf",
                    "type": "text",
                    "required": true,
                    "min": 2,
                    "max": 200,
                    "required_on_authentication": true
                };
            }

            var found = false;
            ef.forEach(function(e) {
                if (e.name === name) {
                    found = true;
                    e.must = true;
                } else {
                    e.must = false;
                }
            });

            if (!found) {
                ef.push(must);
            }
        }

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

        angular.extend(scope, {
            saveCensus: saveCensus,
            delEf: delEf,
            addEf: addEf,
            addToCensus: addToCensus,
            delVoter: delVoter,
            massiveAdd: massiveAdd,
        });

        must_extra_fields();
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-directives/elcensus/elcensus.html'
    };
  }]);
