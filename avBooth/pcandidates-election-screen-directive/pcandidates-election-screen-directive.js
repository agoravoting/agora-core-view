/*
 * Drafts election screen directive.
 *
 * This is a multiple question view, crafted for a specific election that has
 * some unique details.
 */
angular.module('avBooth')
  .directive('avbPcandidatesElectionScreen', function($i18next, $filter, $interpolate, $timeout, $window) {

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

        scope.clearSelectionWarnings();
      };

      scope.deselectTeam = function(team) {
        // deselect the whole group
        _.each(team.options, function (cell) {
          _.each(cell, function(option) {
            option.selected = -1;
          });
          cell.selected = 0;
        });
        team.isSelected = false;
        scope.clearSelectionWarnings();
      };

      scope.toggleTeam = function(team) {
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
          _.each(team.options, function (cell, index) {
            // the maximum number of selected items for this question
            if (_.filter(scope.getSelection(), function (opt) {
                return opt.question_index === index;
              }).length + cell.length - cell.selected > scope.election.questions[index].max)
            {
              canSelect = false;
            }
          });

          // if we can't select the row, then deselect it, unless it has no selection
          // then show warning
          if (!canSelect && totalSelectedInTeam > 0) {
            return scope.deselectTeam(team);
          } else if (!canSelect && totalSelectedInTeam === 0) {
            _.each(scope.election.questions, function(_, index) {
              team["isOpen" + index] = true;
            });
            return scope.showWarning(scope.warningEnum.cannotSelectAll);
          }

          // select the whole group
          _.each(team.options, function (cell) {
            _.each(cell, function(option) {
              option.selected = option.sort_order;
            });
            cell.selected = cell.length;
          });
          team.isSelected = true;
        }
        scope.clearSelectionWarnings();
      };

      scope.toggleCell = function (team, question_index) {
        // if cell is totally selected, deselect it all
        var cell = team.options[question_index];
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
              return opt.question_index === question_index;
            }).length + cell.length - cell.selected > scope.election.questions[question_index].max)
          {
            // if cell is not open.. open it
            if (!team["isOpen" + question_index]) {
              if ($window.innerHeight < 768) {
                team["isOpen" + question_index] = true;
              } else {
                _.each(scope.election.questions, function(_, index) {
                  team["isOpen" + index] = true;
                });
              }
            }
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

      scope.toggleCandidate = function (team, candidate) {
        // if not selected --> try to select it
        var cell = team.options[candidate.question_index];
        if (candidate.selected === -1) {
          if (_.filter(scope.getSelection(), function (opt) {
              return opt.question_index === candidate.question_index;
            }).length + 1 > scope.election.questions[candidate.question_index].max)
          {
            return scope.showWarning(scope.warningEnum.cannotSelectAll);
          }

          candidate.selected = candidate.sort_order;
          cell.selected += 1;
          scope.clearSelectionWarnings();

        // deselect it
        } else {
          candidate.selected = -1;
          cell.selected -= 1;
          scope.clearSelectionWarnings();
        }
        team.isSelected = $filter("avbHasSelectedOptions")(team.group);
      };

      scope.getSelection = function () {
        return $filter('avbSelectedOptions')(scope.allOptions);
      };

      scope.numSelectedByQuestionIndex = function (question_index) {
        return _.filter(scope.getSelection(), function (opt) {
            return opt.question_index === question_index;
          }).length;
      };

      scope.numTotalByQuestionIndex = function (question_index) {
        return scope.election.questions[question_index].max;
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
      // reduce all the options of all questions in only one list, but each
      // answer is tagged with its question_slug (apart from the tag of the
      // category) This kind of list is good for filtering/searching
      _.each(scope.election.questions, function(question, index) {
        question.question_index = index;
      });
      scope.allOptions = _.reduce(scope.election.questions, function(memo, question) {
        var taggedAnswers = _.map(question.answers, function (answer) {
          answer.question_index = question.question_index;
          answer.title = answer.text;
          if (answer.selected === undefined) {
            answer.selected = -1;
          }
          return answer;
        });
        return _.union(memo, taggedAnswers);
      }, []);

      // change sort_order of "Candidatura no agrupada" options
      var filtered = _.filter(scope.allOptions, function(opt) { return opt.category === "Candidatura no agrupada"; });
      // we can't just sample the groupedOptions list because we need to
      // 1. use the same list object
      // 2. generate a specific ordering for all the options
      var i = -1;
      var randomFiltered = _.shuffle(_.map(filtered, function () { i += 1; return i;}));
      // map different sort orders
      randomFiltered = _.map(randomFiltered, function (index) { return filtered[index].sort_order;});
      // now, assign
      _.each(filtered, function (opt, index) { opt.sort_order = randomFiltered[index];});

      // group answers by category
      scope.groupedOptions = _.map(
        _.groupBy(scope.allOptions, "category"),
        function (group) {
          var groupedByQuestion = _.groupBy(group, "question_index");
          _.each(groupedByQuestion, function(l, key, list) {
            l.sort(function (item1, item2) { return item1.sort_order - item2.sort_order; });
          });
          _.each(scope.election.questions, function(val, index) {
            groupedByQuestion["isOpen" + index] = false;
            groupedByQuestion["isOpen" + index + "Dropdown"] = false;
          });
          return $.extend({
            sortOrder: group[0].sort_order,
            isSelected: $filter("avbHasSelectedOptions")(group),
            title: group[0].category,
            group: group,
            options: _.map(scope.election.questions, function (question) {
              if (groupedByQuestion[question.question_index] !== undefined) {
                return groupedByQuestion[question.question_index];
              } else {
                return [];
              }
            }),
          }, groupedByQuestion);
        });

      scope.toggleOpen = function (team) {
          var current = team["isOpen0"];
          _.each(scope.election.questions, function(val, index) {
            team["isOpen" + index] = !current;
          });
      };

      scope.toggleOpenDropdown = function (team) {
        var current = team["isOpen0Dropdown"];
          _.each(scope.election.questions, function(val, index) {
            team["isOpen" + index + "Dropdown"] = !current;
          });
      };

      // randomize by column
      scope.randomizeByColumn = function (question_index) {
        var max = scope.groupedOptions.length;

        // we can't just sample the groupedOptions list because we need to
        // 1. use the same list object
        // 2. generate a specific ordering for all the options
        var i = 0;
        var randomList = _.shuffle(
          _.map(scope.groupedOptions,
            function () { i += 1; return i;}
          ));

        for (i = 0; i < max; i++) {
          var team = scope.groupedOptions[i];
          if (team.options[question_index].length > 0) {
            team.sortOrder = randomList[i];
          } else {
            var found = false;
            /* jshint ignore:start */
            _.each(scope.election.questions, function(val, index) {
              if (team.options[index].length > 0) {
                found = true;
                team.sortOrder = randomList[i] + max*(1+index);
              }
            });
            /* jshint ignore:end */
          }
        }
        scope.groupedOptions.sort(function (item1, item2) { return item1.sortOrder - item2.sortOrder; });
        updateFilteredOptions();
      };

      // sort by last column
      scope.randomizeByColumn(scope.election.questions.length - 1);

      scope.numSelectedOptions = function () {
        return _.filter(
          scope.allOptions,
          function (element) {
            return element.selected > -1;
          }).length;
      };


      // TODO: only use this when localeCompare is unavailable
      function removeAccents(value) {
        return value
          .replace(/á/g, 'a')
          .replace(/é/g, 'e')
          .replace(/í/g, 'i')
          .replace(/ó/g, 'o')
          .replace(/ú/g, 'u')
          .replace(/ñ/g, 'n');
      }

      function hasMatch(text, filter) {
        return removeAccents(text.toLowerCase()).indexOf(filter) > -1;
      }

      // filter function that filters option.value ignoring accents
      function filterRow(team) {
          if (!scope.stateData.filter) {
            return true;
          }

          var filter = removeAccents(scope.stateData.filter.toLowerCase());
          if (hasMatch(team.title, filter)) {
            return true;
          }
          /* jshint ignore:start */
          for (var i = 0; i < scope.election.questions.length; i++) {
            if (_.find(team.options[i], function (candidate) {
                return hasMatch(candidate.text, filter);
              }) !== undefined) {
              return true;
            }
          }
          /* jshint ignore:end */
          return false;
      }


      function updateFilteredOptions() {
        scope.filteredOptions = $filter('filter')(scope.groupedOptions, filterRow);
      }

      scope.$watch("stateData.filter", updateFilteredOptions);
      updateFilteredOptions();


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