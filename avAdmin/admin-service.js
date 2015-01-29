angular.module('avAdmin')

    .factory('AuthApi', ['ConfigService', '$http', function(ConfigService, $http) {
        var backendUrl = ConfigService.authAPI;
        var authapi = {};

        authapi.electionsIds = function(page) {
            if (!page) {
                page = 1;
            }
            return $http.get(backendUrl + 'acl/mine/?object_type=AuthEvent&perm=edit&page='+page);
        };

        authapi.sendAuthCodes = function(eid) {
            var url = backendUrl + 'auth-event/'+eid+'/census/send_auth/';
            // TODO add template
            var data = {};
            return $http.post(url, data);
        };

        authapi.changeAuthEvent = function(eid, st) {
            var url = backendUrl + 'auth-event/'+eid+'/'+st+'/';
            var data = {};
            return $http.post(url, data);
        };

        return authapi;

    }])

    .factory('ElectionsApi', ['$q', 'Authmethod', 'ConfigService', '$http', function($q, Authmethod, ConfigService, $http) {
        var backendUrl = ConfigService.electionsAPI;
        var electionsapi = {cache: {}, permcache: {}};

        function asyncElection(id) {
            var deferred = $q.defer();

            electionsapi.election(id)
                .success(function(data) {
                    var el = electionsapi.parseElection(data);
                    deferred.resolve(el);
                }).error(deferred.reject);

            return deferred.promise;
        }

        function asyncElectionAuth(el) {
            var deferred = $q.defer();

            Authmethod.viewEvent(el.id)
                .success(function(data) {
                    el.auth = {};
                    el.auth.authentication = data.events.auth_method;
                    el.auth.census = data.events.users;
                    if (el.auth.census) {
                        el.votes = el.stats.votes;
                        el.votes_percentage = ( el.stats.votes * 100 )/ el.auth.census;
                    } else {
                        el.votes_percentage = 0;
                        el.votes = el.stats.votes || 0;
                    }
                    deferred.resolve(el);
                })
                .error(deferred.reject);

            return deferred.promise;
        }

        electionsapi.cache_election = function(id, election) {
            electionsapi.chache[id] = election;
        };

        electionsapi.getElection = function(id) {
            var deferred = $q.defer();

            var cached = electionsapi.cache[id];
            if (!cached) {
                asyncElection(id)
                  .then(electionsapi.stats)
                  .then(asyncElectionAuth)
                  .then(deferred.resolve)
                  .catch(deferred.reject);
            } else {
                deferred.resolve(cached);
            }

            return deferred.promise;
        };

        electionsapi.election = function(id) {
            return $http.get(backendUrl + 'election/'+id);
        };

        electionsapi.parseElection = function(d) {
            var election = d.payload;
            var conf = election.configuration;
            conf.status = election.state;
            conf.stats = {};
            conf.results = {};

            conf.votes = 0;
            conf.votes_percentage = 0;

            // number of answers
            conf.answers = 0;
            conf.questions.forEach(function(q) {
                conf.answers += q.answers.length;
            });

            // adding director to the list of authorities
            conf.auths = [conf.director, ];
            conf.authorities.forEach(function(a) { conf.auths.push(a); });

            // results
            if (election.results) {
                conf.results = angular.fromJson(election.results);
            }

            // caching election
            electionsapi.cache[conf.id] = conf;
            return conf;
        };

        electionsapi.generateElection = function(d) {
            var el = {
                "id": d.id,
                "title": d.title,
                "description": d.description,
                "director": "test-auth1.agoravoting.com",
                "authorities": ["test-auth2.agoravoting.com"],
                "layout": "pcandidates-election",
                "presentation": {
                  "share_text": "share this",
                  "theme": "default",
                  "urls": [ { "title": "", "url": "" } ],
                  "theme_css": "default"
                },
                "end_date": "2015-01-12T18:17:14.457000",
                "start_date": "2015-01-06T18:17:14.457000",
                "questions": []
            };

            d.questions.forEach(function(q) {
                var nq = {
                    "description": q.title,
                    "layout": "pcandidates-election",
                    "max": q.max,
                    "min": q.min,
                    "num_winners": 1,
                    "title": q.title,
                    "randomize_answer_order": true,
                    "tally_type": "plurality-at-large",
                    "answer_total_votes_percentage": "over-total-valid-votes",
                    "answers": []
                };
                q.answers.forEach(function(a, index) {
                    var na = {
                        "id": index,
                        "category": "cat",
                        "details": "",
                        "sort_order": index + 1,
                        "urls": [ { "title": "", "url": "" } ],
                        "text": a.text
                    };
                    nq['answers'].push(na);
                });
                el['questions'].push(nq);
            });

            return el;
        };

        electionsapi.createElection = function(data, createPerm, adminPerm, success, error) {
            var el = electionsapi.generateElection(data);
            var id = el.id;

            // register
            var reg = $http.post(backendUrl + 'election', el, {headers: {'Authorization': createPerm}});

            // create
            reg.success(function(data) {
                var create = $http.post(backendUrl + 'election/'+id+'/create', el, {headers: {'Authorization': adminPerm}});
                create.success(success).error(error);
            });
            reg.error(error);
        };

        electionsapi.updateElection = function(data, adminPerm) {
            var el = electionsapi.generateElection(data);
            var id = el.id;

            var update = $http.post(backendUrl + 'election/'+id, el, {headers: {'Authorization': adminPerm}});
            return update;
        };

        electionsapi.getEditPerm = function(id) {
            var deferred = $q.defer();

            var cached = electionsapi.permcache[id];
            if (!cached) {
                Authmethod.getPerm("edit", "AuthEvent", id)
                    .success(function(data) {
                        var perm = data['permission-token'];
                        electionsapi.permcache[id] = perm;
                        deferred.resolve(perm);
                    });
            } else {
                deferred.resolve(cached);
            }

            return deferred.promise;
        };

        electionsapi.stats = function(el) {
            var deferred = $q.defer();

            electionsapi.command(el, 'stats', 'GET')
                .then(function(d) {
                        el.stats = d.payload;
                        deferred.resolve(el);
                      })
                 .catch(deferred.reject);

            return deferred.promise;
        };

        electionsapi.command = function(el, command, method, data) {
            var deferred = $q.defer();
            var m = {};
            var d = data || {};
            var url = backendUrl + 'election/'+el.id+'/'+command;

            electionsapi.getEditPerm(el.id)
                .then(function(perm) {
                    if (method === "POST") {
                        m = $http.post(url, data, {headers: {'Authorization': perm}});
                    } else {
                        m = $http.get(url, {headers: {'Authorization': perm}});
                    }

                    m.success(deferred.resolve).error(deferred.reject);
                });

            return deferred.promise;
        };

        return electionsapi;
    }]);
