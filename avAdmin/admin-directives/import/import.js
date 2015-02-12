angular.module('avAdmin')
  .directive('avAdminImport', ['$window', 'ElectionsApi', '$state', function($window, ElectionsApi, $state) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        scope.loading = false;
        scope.file = null;
        scope.parsed = null;

        var headers = {
            timestamp: "Timestamp",
            org: "Organización",
            admin: "Nombre del administrador",
            email: "E-mail del administrador",
            phone: "Teléfono del administrador",
            title: "Título",
            desc: "Descripción",
            start: "Comienzo",
            end: "Final",
            auth: "Método de autenticación",
            census: "Censo cerrado o abierto",
            voters: "Censo",
            winners: "Número de ganadores",
            min: "Número mínimo de opciones",
            max: "Número máximo de opciones",
            opts: "Opciones",
            random: "Orden aleatorio",
            results: "Resultados",
            moreq: "¿Más preguntas?"
        };

        var trans = {
            "abierto": "open",
            "cerrado": "close"
        };

        var headers1 = {};
        _.forEach(headers, function(v, k) { headers1[v] = k; });

        function getIndex(indexes, value) {
            return indexes.indexOf(headers[value]);
        }

        function parsedDate(d) {
            var fmt = "M/D/YYYY HH:mm:SS";
            var m = $window.moment(d, fmt);

            // Hack to avoid election orchestra error
            var date = m.toJSON().slice(0, 19);
            date += '.001';

            return date;
        }

        function rawToEl(rawel) {
            if (!rawel.desc) {
                return null;
            }

            var el = ElectionsApi.templateEl();

            el.title = rawel['title'];
            el.description = rawel['desc'];
            el.start_date = parsedDate(rawel['start']);
            el.end_date = parsedDate(rawel['end']);
            el.census.census = trans[rawel['census'].toLowerCase()];
            var auth = rawel['auth'].toLowerCase();
            if (auth === "sms") {
                el.census.auth_method = 'sms';
            } else {
                el.census.auth_method = 'email';
            }

            rawel['voters'].forEach(function(x) {
                var voter = {};
                if (auth === "sms") {
                    voter['tlf'] = x;
                } else {
                    voter['email'] = x;
                }
                el.census.voters.push(voter);
            });

            rawel['questions'].forEach(function(x) {
                var q = ElectionsApi.templateQ("");
                q.title = x.title;
                q.description = x.desc;
                q.max = parseInt(x.max, 10);
                q.min = parseInt(x.min, 10);
                q.num_winners = parseInt(x.winners, 10);
                q.randomize_answer_order = x.random;
                //q.answer_total_votes_percentage = x.results;
                x.opts.forEach(function(y, i) {
                    var a = {
                        category: "",
                        details: "",
                        id: i,
                        sort_order: i,
                        text: y,
                        urls: []
                    };
                    q.answers.push(a);
                });

                el.questions.push(q);
            });
            return el;
        }

        function parseElection(cvs, indexes) {
            var rawEl = {questions: []};

            var q = {};
            var questions = false;
            var filter = function(x) { return x; };
            for(var i=0; i<cvs.length; i++) {
                var h = headers1[indexes[i]];
                var v = cvs[i];

                if (!questions) {
                    rawEl[h] = v;
                    if (h === "voters") {
                        rawEl[h] = v.split("\n");
                        rawEl[h] = _.filter(rawEl[h], filter);
                    }
                    if (h === "voters") {
                        questions = true;
                    }
                } else {
                    if (h === "moreq") {
                        if (q.title) {
                            rawEl.questions.push(q);
                        }
                        q = {};
                        if (v.toLowerCase().indexOf("no") > 0) {
                            break;
                        }
                    } else {
                        q[h] = v;
                        if (h === "opts") {
                            q[h] = v.split("\n");
                            q[h] = _.filter(q[h], filter);
                        }
                        if (h === "random") {
                            q[h] = v.toLowerCase().indexOf("no") < 0;
                        }
                    }
                }
            }

            return rawToEl(rawEl);
        }

        function parseElections(cvs) {
            var indexes = cvs[0];
            var els = [];
            for (var i=1; i<cvs.length; i++) {
                var el = parseElection(cvs[i], indexes);
                if (el) {
                    els.push(el);
                }
            }

            return els;
        }

        function selectFile() {
            document.querySelector("#importfile").click();
        }

        function uploadFile(element) {
            scope.loading = true;

            var f = element.files[0];
            scope.$apply(function() {
                scope.file = f;
            });

            $window.Papa.parse(f, {
                complete: function(results) {
                    scope.loading = false;
                    var els = parseElections(results.data);
                    // only works for one election, the first
                    ElectionsApi.setCurrent(els[0]);
                    ElectionsApi.newElection = true;
                    $state.go("admin.create");
                },
            });
        }

        angular.extend(scope, {
          selectFile: selectFile,
          uploadFile: uploadFile
        });
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-directives/import/import.html'
    };
  }]);
