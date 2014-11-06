/*
 * Drafts election screen directive.
 *
 * This is a multiple question view, crafted for a specific election that has
 * some unique details.
 */
angular.module('avBooth')
  .directive('avbPcandidatesElectionScreen', function($i18next, $filter, $interpolate, $timeout) {

    var link = function(scope, element, attrs) {
      scope.warningEnum = {
        // shown when the user has already select all possible options
        maxSelectedLimitReached: "maxSelectedLimitReached",
        cannotSelectAll: "cannotSelectAll"
      };

      scope.stateData.affixIsSet = false;
      scope.stateData.affixDropDownShown = false;

      /*
       * Toggles selection, if possible.
       */
      scope.toggleSelectItem = function(option) {
        var selection = scope.getSelection();
        var subselection = _.filter(option.documents, function (doc) {
          return doc.selected > -1;
        });

        // TODO

        scope.clearSelectionWarnings();
      };

      scope.deselectTeam = function(team) {
        var slugs = ["secretario", "consejo", "garantias"];
        // deselect the whole group
        _.each(slugs, function (slug) {
          var cell = team[slug];
          _.each(cell, function(option) {
            option.selected = -1;
          });
          cell.selected = 0;
        });
        team.isSelected = false;
        scope.clearSelectionWarnings();
      };

      scope.toggleTeam = function(team) {
        var slugs = ["secretario", "consejo", "garantias"];
        var canSelect = true;
        var teamSize = team.group.length;
        var totalSelectedInTeam = _.filter(team.group, function (opt) {
          return opt.selected > -1;
        }).length;

        // deselect if all team options are already selected
        if (teamSize === totalSelectedInTeam) {
          scope.deselectTeam(team);
        // try to select all if not all were selected
        } else {

          // detect if we can select
          _.each(slugs, function (slug) {
            var cell = team[slug];
            // the maximum number of selected items for this question
            if (_.filter(scope.getSelection(), function (opt) {
                return opt.question_slug === slug;
              }).length + cell.length - cell.selected > scope.questionsDict[slug].max)
            {
              canSelect = false;
            }
          });

          // if we can't select the row, then deselect it, unless it has no selection
          // then show warning
          if (!canSelect && totalSelectedInTeam > 0) {
            return scope.deselectTeam(team);
          } else if (!canSelect && totalSelectedInTeam === 0) {
            return scope.showWarning(scope.warningEnum.cannotSelectAll);
          }

          // select the whole group
          _.each(slugs, function (slug) {
            var cell = team[slug];
            _.each(cell, function(option) {
              option.selected = option.sort_order;
            });
            cell.selected = cell.length;
          });
          team.isSelected = true;
        }
        scope.clearSelectionWarnings();
      };

      scope.toggleCell = function (team, question_slug) {
        // if cell is totally selected, deselect it all
        var cell = team[question_slug];
        if (cell.selected === cell.length) {
          _.each(cell, function(option) {
            option.selected = -1;
          });
          cell.selected = 0;
          scope.clearSelectionWarnings();

        // if less than all the elements are selected, select them all
        } else {
          var selection = scope.getSelection();
          // check that adding the options that are not selected does not exceed
          // the maximum number of selected items for this question
          if (_.filter(scope.getSelection(), function (opt) {
              return opt.question_slug === question_slug;
            }).length + cell.length - cell.selected > scope.questionsDict[question_slug].max)
          {
            return scope.showWarning(scope.warningEnum.cannotSelectAll);
          }

          // checks done -> select them all
          _.each(cell, function(option) {
            if (option.selected !== option.sort_order) {
              option.selected = option.sort_order;
            }
          });
          cell.selected = cell.length;
          scope.clearSelectionWarnings();
        }

        team.isSelected = $filter("avbHasSelectedOptions")(team.group);
      };


      scope.getSelection = function () {
        return $filter('avbSelectedOptions')(scope.allOptions);
      };

      scope.showWarning = function (warn) {
        // if warning is already being shown, just flash it instantly
        if (scope.shownWarning === warn) {
            $("#" + warn).flash("white", "#D9534F", 200);

        // if warning is not being shown, then change it and wait a bit for it
        // to be shown to flash it
        } else {
          scope.shownWarning = warn;
          $timeout(function () {
            $("#" + warn).flash("white", "#D9534F", 200);
          }, 150);
        }
      };

      // directly accesable associative array, where the keys are the
      // question_slugs and the values the questions
      scope.questionsDict = {};

      // reduce all the options of all questions in only one list, but each
      // answer is tagged with its question_slug (apart from the tag of the
      // category) This kind of list is good for filtering/searching
      scope.allOptions = _.reduce(scope.election.questions_data, function(memo, question) {
      scope.questionsDict[question.question_slug] = question;
        var taggedAnswers = _.map(question.answers, function (answer) {
          answer.question_slug = question.question_slug;
          answer.title = answer.value;
          if (answer.selected === undefined) {
            answer.selected = -1;
          }
          return answer;
        });
        return _.union(memo, taggedAnswers);
      }, []);

      // group answers by category
      scope.groupedOptions = _.map(
        _.groupBy(scope.allOptions, "category"),
        function (group) {
          var groupedByQuestion = _.groupBy(group, "question_slug");
          _.each(groupedByQuestion, function(l, key, list) {
            l.sort(function (item1, item2) { return item1.sortOrder - item2.sortOrder; });
          });
          return $.extend({
            isOpen: false,
            isOpenDropdown: false,
            sortOrder: group[0].sort_order,
            isSelected: $filter("avbHasSelectedOptions")(group),
            title: group[0].category,
            group: group,
            secretario: [],
            consejo: [],
            garantias: [],
          }, groupedByQuestion);
        });

      // sort by given order
      scope.groupedOptions = _.sortBy(scope.groupedOptions, "sortOrder");

      scope.numSelectedOptions = function () {
        return _.filter(
          scope.allOptions,
          function (element) {
            return element.selected > -1;
          }).length;
      };

      scope.showNext = function() {
        scope.next();
      };

      // watch for changes in selection, changing the warning if need be
      scope.shownWarning = "";
      scope.clearSelectionWarnings = function () {
        scope.shownWarning  = "";
      };
      scope.clearSelectionWarnings();
    };

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avBooth/pcandidates-election-screen-directive/pcandidates-election-screen-directive.html'
    };
  });