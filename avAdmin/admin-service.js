angular.module('avAdmin')

    .factory('AuthApi', ['ConfigService', '$http', function(ConfigService, $http) {
        var backendUrl = ConfigService.authAPI;
        var authapi = {};

        authapi.electionsIds = function(page) {
            if (!page) {
                page = 1;
            }
            return $http.get(backendUrl + 'acl/mine/?object_type=AuthEvent&perm=admin&page='+page);
        };

        authapi.getPerm = function(perm, object_type, object_id) {
            var data = {
                permission: perm,
                object_type: object_type,
                object_id: object_id + "" // to convert to string
            };
            return $http.post(backendUrl + 'get-perms/', data);
        };

        return authapi;

    }])

    .factory('ElectionsApi', ['Authmethod', 'ConfigService', '$http', function(Authmethod, ConfigService, $http) {
        var backendUrl = ConfigService.electionsAPI;
        var electionsapi = {cache: {}};

        electionsapi.cache_election = function(id, election) {
            electionsapi.chache[id] = election;
        };

        electionsapi.get_election = function(id, success, error) {
            var cached = electionsapi.cache[id];
            if (!cached) {
                electionsapi.election(id)
                    .success(function(data) {
                        var el = electionsapi.parseElection(data);
                        // getting auth info, census and other data
                        Authmethod.viewEvent(id)
                            .success(function(data) {
                                el.auth = {};
                                el.auth.authentication = data.events.auth_method;
                                el.auth.census = data.events.users;
                                if (el.auth.census) {
                                    el.votes_percentage = (el.stats.votes * 100 )/ el.auth.census;
                                } else {
                                    el.votes_percentage = 0;
                                }
                                success(el);
                            })
                            .error(error);
                    }).error(error);
            } else {
                success(cached);
            }
        };

        electionsapi.election = function(id) {
            return $http.get(backendUrl + 'election/'+id);
        };

        electionsapi.parseElection = function(d) {
            var election = d.payload;
            var conf = election.configuration;
            conf.status = election.state;
            conf.stats = election.stats;

            // TODO make it real
            conf.votes = conf.stats.votes;
            conf.votes_percentage = 0;

            // number of answers
            conf.answers = 0;
            conf.questions.forEach(function(q) {
                conf.answers += q.answers.length;
            });

            // adding director to the list of authorities
            conf.auths = [conf.director, ];
            conf.authorities.forEach(function(a) { conf.auths.push(a); });


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

        return electionsapi;
    }]);
