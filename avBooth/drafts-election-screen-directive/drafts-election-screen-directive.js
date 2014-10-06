/*
 * Drafts election screen directive.
 *
 * This is a multiple question view, crafted for a specific election that has
 * some unique details. Basically, the voter has N points, one per question.
 * All the possible answers are shown in a single list, that is categorized by
 * question. *But* as answers refer to document created by a sponsor group,
 * when a sponsor group has created a document for each answer, this is showed
 * as a "pack" in a special "whole packs" category.
 */
angular.module('avBooth')
  .directive('avbDraftsElectionScreen', function($i18next, $filter, $interpolate) {

    var link = function(scope, element, attrs) {
      scope.warningEnum = {
        // shown when the user has not selected any option
        selectMoreOpts: "selectMoreOpts",

        // shown when the user has already select all possible options
        maxSelectedLimitReached: "maxSelectedLimitReached",

        // shown if the user tries to select a pack and there's already a
        // pack selected
        alreadySelectedAPack: "alreadySelectedAPack",

        // shown if the user tries to select a normal option and there's
        // another normal option already selected in that category
        optionInCategoryAlreadySelected: "optionInCategoryAlreadySelected",

        // shown if the user tries to select a normal option and there's a pack
        // already selected
        cantSelectNormalOptionPackAlreadySelected: "cantSelectNormalOptionPackAlreadySelected",

        // shown if the user tries to select a pack and there's some normal
        // options already selected
        cantSelectPackNormalOptionAlreadySelected: "cantSelectPackNormalOptionAlreadySelected"
      };

      scope.stateData.affixIsSet = false;
      scope.stateData.affixDropDownShown = false;

      /*
       * Toggles selection, if possible.
       */
      scope.toggleSelectItem = function(option) {
        var selection = scope.getSelection();

        // we do different things for packs and normal options. Here for packs:
        if (option.isPack) {
          // deselect the pack
          if (option.selected > -1) {
            option.selected = -1;

          // select the pack
          } else {
            // to select a pack, selection must be empty
            if (selection.length > 0 && selection[0].isPack) {
                return scope.showWarning(scope.warningEnum.alreadySelectedAPack);
            } else if (selection.length > 0) {
                return scope.showWarning(scope.warningEnum.cantSelectPackNormalOptionAlreadySelected);
            }
            option.selected = 0;
          }
          _.each(option.suboptions, function (opt) { opt.selected = option.selected; });

        // and here for normal options
        } else {
          // deselect the option
          if (option.selected > -1) {
            option.selected = -1;

          // select the option
          } else {
            // detect problems
            var sameInCategory = _.filter(selection, function (opt) {
              return !opt.isPack && opt.category === option.category;
            }).length > 0;
            if (selection.length > 0 && selection[0].isPack) {
                return scope.showWarning(scope.warningEnum.cantSelectNormalOptionPackAlreadySelected);
            } else if (sameInCategory) {
                return scope.showWarning(scope.warningEnum.optionInCategoryAlreadySelected);
            }
            option.selected = 0;
          }

          scope.updateSelectionWarnings();
        }
      };

      scope.getSelection = function () {
        return $filter('avbSelectedOptions')(scope.flatOptions);
      };

      scope.showWarning = function (warn) {
        scope.shownWarning = warn;
        $("#" + warn).flash("white", "#0081B9", 200);
      };

      // reduce all the options of all questions in only one list, but each
      // answer is tagged with its question
      scope.allOptions = _.reduce(scope.election.questions, function(memo, question) {
        var taggedAnswers = _.map(question.answers, function (answer) {
          answer.category = question.description;
          answer.title = answer.value;
          if (answer.selected === undefined) {
            answer.selected = -1;
          }
          return answer;
        });
        return _.union(memo, taggedAnswers);
      }, []);

      // group answers by value
      var groupedAnswers = _.groupBy(scope.allOptions, "value");

      // filter only answers that have an answer for each question (= packs)
      // the result is a list of pairs
      // the result will be something like:
      // [
      //   [
      //     "Propuesta de Fulanito",
      //     [
      //       {
      //         value: "Propuesta de Fulanito",
      //         details: "whatever",
      //         category: "¿Cual quieres que sea el documento blah blah?",
      //         urls: [
      //           {title: "Ver pdf", url: "https://example.com"}
      //         ]
      //       },
      //       ...
      //     ]
      //   ], ..
      // ]
      var packs = _.filter(_.pairs(groupedAnswers), function (pair) {
        return pair[1].length === scope.election.questions.length;
      });

      var packsCategory = {
        title: $i18next("avBooth.completePacksTitle"),
        isPack: true,
        isOpen: true,
        options: _.map(packs, function (pair) {
          var selected = -1;
          if (pair[1][0].selected !== undefined) {
            selected = pair[1][0].selected;
          }
          return {
            title: pair[0],
            isPack: true,
            isOpen: false,
            isOpen2: false,
            media_url: pair[1][0].media_url,
            selected: selected,
            details: pair[1][0].details,
            suboptions: pair[1]
          };
        })
      };

      var packsTitles = _.pluck(packsCategory.options, "title");

      // get all the options that are not in a pack
      var nonPackedOptions = _.filter(scope.allOptions, function (option) {
        return !_.contains(packsTitles, option.value);
      });

      var categorizedNonPackedOptions = _.groupBy(nonPackedOptions, "category");
      scope.categories = _.map(
        _.pairs(categorizedNonPackedOptions),
        function (pair) {
          return {
            title: pair[0],
            isPack: false,
            isOpen: false,
            isOpen2: false,
            options: pair[1]
          };
        });

      // makes packs to be the first category
      scope.categories.unshift(packsCategory);

      // packs + normal options in one list
      scope.flatOptions = _.flatten(_.pluck(scope.categories, "options"));

      scope.numSelectedOptions = function () {
        return _.filter(
          scope.allOptions,
          function (element) {
            return element.selected > -1;
          }).length;
      };

      // questionNext calls to scope.next() if user selected enough options.
      // If not, then it flashes the #selectMoreOptsWarning div so that user
      // notices.
      scope.showNext = function() {
        if (scope.numSelectedOptions() < scope.election.min) {
          $("#selectMoreOptsWarning").flash("white", "#d9534f", 200);
          return;
        }
        scope.next();
      };

      scope.flashWarning = function (warningName) {
        console.log(warningName);
      };

      // watch for changes in selection, changing the warning if need be
      scope.shownWarning = "";
      scope.updateSelectionWarnings = function updateSelectionWarnings() {
        var selection = $filter('avbSelectedOptions')(scope.flatOptions);
        var hasPackValidOpts = [
          scope.warningEnum.maxSelectedLimitReached,
          scope.warningEnum.alreadySelectedAPack,
          scope.warningEnum.cantSelectNormalOptionPackAlreadySelected
        ];
        console.log("updateSelectionWarnings: " + selection.length);

        // if no option
        if (selection.length === 0) {
          scope.shownWarning = scope.warningEnum.selectMoreOpts;

        // if it's a pack
        } else if (selection.length === 1 && selection[0].isPack) {
          if (_.contains(hasPackValidOpts, scope.shownWarning)) {
            return;
          } else {
            scope.shownWarning = scope.warningEnum.maxSelectedLimitReached;
          }

        // if at least one normal option is selected
        } else if (selection.length < scope.election.max) {
          scope.shownWarning = "";

        // if max normal options selected
        } else if (selection.length === scope.election.max) {
          scope.shownWarning = scope.warningEnum.maxSelectedLimitReached;
        }
      };
      scope.updateSelectionWarnings();
    };

    return {
      restrict: 'E',
      link: link,
      templateUrl: 'avBooth/drafts-election-screen-directive/drafts-election-screen-directive.html'
    };
  });