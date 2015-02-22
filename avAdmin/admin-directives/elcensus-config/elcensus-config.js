angular.module('avAdmin')
  .directive('avAdminElcensusConfig', function($window, $state, ElectionsApi) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        scope.census = ['open', 'close'];
        scope.election = ElectionsApi.currentElection;
        scope.newef = {};
        scope.newcensus = {};
        scope.extra_fields = {editing: null};
        scope.massiveef = "";
        scope.loadingcensus = !ElectionsApi.newElection;

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

        function addEf() {
            var el = ElectionsApi.currentElection;
            var efs = el.census.extra_fields;

            var ef = {
                name: scope.newef.name,
                type: "text",
                required: scope.newef.required,
                min: 2,
                max: 200,
                required_on_authentication: true,
                must: false
            };

            scope.extra_fields.editing = ef;

            scope.newef = {};
            efs.unshift(ef);
        }

        angular.extend(scope, {
            addEf: addEf
        });

        function main() {
            scope.election = ElectionsApi.currentElection;
            must_extra_fields();
        }

        ElectionsApi.waitForCurrent(main);
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-directives/elcensus-config/elcensus-config.html'
    };
  });
