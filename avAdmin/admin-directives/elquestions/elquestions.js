angular.module('avAdmin')
  .directive('avAdminElquestions', ['$i18next', '$state', 'ElectionsApi', function($i18next, $state, ElectionsApi) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        scope.election = ElectionsApi.currentElection;
        scope.vsystems = ['plurality-at-large', 'borda-nauru', 'borda'];

        scope.electionEditable = function() {
          return !scope.election.id || scope.election.status === "registered";
        };

        function save() {
            $state.go("admin.auth");
        }

        function newq() {
            var el = ElectionsApi.currentElection;
            if (!el.questions) {
                el.questions = [];
            }
            // New question
            var q = ElectionsApi.templateQ($i18next("avAdmin.questions.new") + " " + el.questions.length);
            el.questions.push(q);
            expand(el.questions.length - 1);
        }

        function delq(index) {
            var el = ElectionsApi.currentElection;
            var qs = el.questions;
            el.questions = qs.slice(0, index).concat(qs.slice(index+1,qs.length));
        }

        function expand(index) {
            var el = ElectionsApi.currentElection;
            var qs = el.questions;
            _.map(qs, function(q) { q.active = false; });
            qs[index].active = true;
        }

        function collapse(index) {
            var el = ElectionsApi.currentElection;
            var qs = el.questions;
            _.map(qs, function(q) { q.active = false; });
        }

        function reorderOptions(index) {
            var el = ElectionsApi.currentElection;
            var qs = el.questions;
            qs[index].answers.forEach(function(an, idx) {
                an.id = idx;
                an.sort_order = idx;
            });
        }

        function addOption(index) {
            var el = ElectionsApi.currentElection;
            var qs = el.questions;
            if (!qs[index].answers) {
                qs[index].answers = [];
            }

            // new answer
            var a = {
                category: "",
                details: "",
                id: 0,
                sort_order: 0,
                text: document.querySelector("#newopt").value,
                urls: []
            };
            qs[index].answers.push(a);
            reorderOptions(index);
            document.querySelector("#newopt").value = "";
        }

        function delOption(i1, i2) {
            var el = ElectionsApi.currentElection;
            var qs = el.questions;
            var as = qs[i1].answers;
            qs[i1].answers = as.slice(0, i2).concat(as.slice(i2+1,as.length));
            reorderOptions(i1);
        }

        function incOpt(index, option, inc) {
            var el = ElectionsApi.currentElection;
            var qs = el.questions;
            var q = qs[index];

            if (!q[option]) {
                q[option] = 0;
            }
            q[option] += inc;
        }

        angular.extend(scope, {
          saveQuestions: save,
          newQuestion: newq,
          delQuestion: delq,
          expandQuestion: expand,
          collapseQuestion: collapse,
          addOption: addOption,
          delOption: delOption,
          incOpt: incOpt,
        });
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-directives/elquestions/elquestions.html'
    };
  }]);
