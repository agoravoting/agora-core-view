angular.module('avAdmin')
  .directive('avAdminCreate', ['$q', 'Authmethod', 'ElectionsApi', '$state', '$i18next', function($q, Authmethod, ElectionsApi, $state, $i18next) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        scope.creating = false;
        scope.creating_text = '';
        scope.error_text = '';
        scope.election = ElectionsApi.currentElection;

        function getCreatePerm(el) {
            var deferred = $q.defer();
            Authmethod.getPerm("create", "AuthEvent", 0)
                .success(function(data) {
                    var perm = data['permission-token'];
                    el.perm = perm;
                    deferred.resolve(el);
                }).error(deferred.reject);

            return deferred.promise;
        }

        function createAuthEvent(el) {
            var deferred = $q.defer();
            // Creating the authentication
            scope.creating_text = $i18next('avAdmin.create.creating');

            var d = {
                auth_method: el.census.auth_method,
                census: el.census.census,
                config: el.census.config,
                extra_fields: []
            };

            d.extra_fields = _.filter(el.census.extra_fields, function(ef) { return !ef.must; });

            Authmethod.createEvent(d)
                .success(function(data) {
                    el.id = data.id;
                    deferred.resolve(el);
                }).error(deferred.reject);
            return deferred.promise;
        }

        function addCensus(el) {
            var deferred = $q.defer();
            // Adding the census
            scope.creating_text = $i18next('avAdmin.create.census');
            Authmethod.addCensus(el.id, el.census.voters)
                .success(function(data) {
                    deferred.resolve(el);
                }).error(deferred.reject);
            return deferred.promise;
        }

        function registerElection(el) {
            var deferred = $q.defer();
            // Registering the election
            scope.creating_text = $i18next('avAdmin.create.reg');
            ElectionsApi.command(el, '', 'POST', el)
                .then(function(data) { deferred.resolve(el); })
                .catch(deferred.reject);
            return deferred.promise;
        }

        function createElection(el) {
            var deferred = $q.defer();
            // Creating the election
            scope.creating_text = $i18next('avAdmin.create.creatingEl');
            ElectionsApi.command(el, 'create', 'POST', {})
                .then(function(data) { deferred.resolve(el); })
                .catch(deferred.reject);
            return deferred.promise;
        }

        function createTheElection() {
            var el = ElectionsApi.currentElection;
            getCreatePerm(el)
                .then(createAuthEvent)
                .then(addCensus)
                .then(registerElection)
                .then(createElection)
                .then(function(el) {
                    waitForCreated(el.id);
                    scope.error_text = '';
                })
                .catch(function(error) {
                    scope.creating = false;
                    scope.creating_text = '';
                    scope.error_text = error;
                });

            scope.creating = true;
        }

        function waitForCreated(id) {
            ElectionsApi.getElection(id, true)
                .then(function(el) {
                    if (el.status === 'created') {
                        $state.go("admin.dashboard", {id: el.id});
                    } else {
                        setTimeout(function() { waitForCreated(id); }, 3000);
                    }
                });
        }

        angular.extend(scope, {
          createElection: createTheElection,
        });
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-directives/create/create.html'
    };
  }]);
