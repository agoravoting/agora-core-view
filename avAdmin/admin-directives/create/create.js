angular.module('avAdmin')
  .directive('avAdminCreate', ['$q', 'Authmethod', 'ElectionsApi', '$state', '$i18next', function($q, Authmethod, ElectionsApi, $state, $i18next) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        scope.creating = false;
        scope.log = '';
        if (ElectionsApi.currentElections.length === 0 && !!ElectionsApi.currentElection) {
          scope.elections = [ElectionsApi.currentElection];
        } else {
          scope.elections = ElectionsApi.currentElections;
          ElectionsApi.currentElections = [];
        }

        function getCreatePerm(el) {
            console.log("creating perm for election " + el.title);
            var deferred = $q.defer();
            Authmethod.getPerm("create", "AuthEvent", 0)
                .success(function(data) {
                    var perm = data['permission-token'];
                    el.perm = perm;
                    deferred.resolve(el);
                }).error(deferred.reject);

            return deferred.promise;
        }

        function logInfo(text) {
          scope.log += "<p>" + text + "</p>";
        }

        function logError(text) {
          scope.log += "<p class=\"text-brand-danger\">" + text + "</p>";
        }

        function createAuthEvent(el) {
            console.log("creating auth event for election " + el.title);
            var deferred = $q.defer();
            // Creating the authentication
            logInfo($i18next('avAdmin.create.creating', {title: el.title}));

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
            console.log("adding census for election " + el.title);
            var deferred = $q.defer();
            // Adding the census
            logInfo($i18next('avAdmin.create.census', {title: el.title, id: el.id}));
            Authmethod.addCensus(el.id, el.census.voters, 'disabled')
                .success(function(data) {
                    deferred.resolve(el);
                }).error(deferred.reject);
            return deferred.promise;
        }

        function registerElection(el) {
            console.log("registering election " + el.title);
            var deferred = $q.defer();
            // Registering the election
            logInfo($i18next('avAdmin.create.reg', {title: el.title, id: el.id}));
            ElectionsApi.command(el, '', 'POST', el)
                .then(function(data) { deferred.resolve(el); })
                .catch(deferred.reject);
            return deferred.promise;
        }

        function createElection(el) {
            console.log("creating election " + el.title);
            var deferred = $q.defer();
            // Creating the election
            logInfo($i18next('avAdmin.create.creatingEl', {title: el.title, id: el.id}));
            ElectionsApi.command(el, 'create', 'POST', {})
              .then(function(data) { deferred.resolve(el); })
              .catch(deferred.reject);
            return deferred.promise;
        }

        function addElection(i) {
          var deferred = $q.defer();
          if (i === scope.elections.length) {
            var el = scope.elections[i - 1];
            $state.go("admin.dashboard", {id: el.id});
            return;
          }

          var promise = deferred.promise;
          promise = promise
            .then(getCreatePerm)
            .then(createAuthEvent)
            .then(addCensus)
            .then(registerElection)
            .then(createElection)
            .then(function(el) {
                console.log("waiting for election " + el.title);
                waitForCreated(el.id, function () {
                  addElection(i+1);
                });
              })
              .catch(function(error) {
                scope.creating = false;
                scope.creating_text = '';
                logError(angular.toJson(error));
              });
          deferred.resolve(scope.elections[i]);
        }

        function createElections() {
            var deferred = $q.defer();
            addElection(0);
            var promise = deferred.promise;

            scope.creating = true;
        }

        function waitForCreated(id, f) {
            console.log("waiting for election id = " + id);
            ElectionsApi.getElection(id, true)
                .then(function(el) {
                    var deferred = $q.defer();
                    if (el.status === 'created') {
                        f();
                    } else {
                        setTimeout(function() { waitForCreated(id, f); }, 3000);
                    }
                });
        }

        angular.extend(scope, {
          createElections: createElections,
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
