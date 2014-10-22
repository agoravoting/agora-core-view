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
  .directive('avbDraftsElectionScreen', function($i18next, $filter, $interpolate, $timeout) {

    var link = function(scope, element, attrs) {
      scope.warningEnum = {
        // shown when the user has already select all possible options
        maxSelectedLimitReached: "maxSelectedLimitReached",

        // shown if the user already selected a document of that type
        alreadySelectedDocumentType: "alreadySelectedDocumentType",

        alreadySelectedPack: "alreadySelectedPack",

        cantSelectPack: "cantSelectPack"
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

        // if it has selection, deselect all of them
        if (option.isSelected) {
          _.each(option.documents, function (doc) {
            if (doc.selected !== -1) {
              doc.selected = -1;
            }
          });
          option.isSelected = false;

        // select all the docs
        } else {
          // check no conflict exist
          if (_.intersection(
            _.pluck(selection, "category"),
            _.pluck(option.documents, "category")
            ).length > 0)
          {
            if (selection.length > 0 && selection[0].isPack) {
              return scope.showWarning(scope.warningEnum.alreadySelectedPack);
            } else if (option.isPack) {
              return scope.showWarning(scope.warningEnum.cantSelectPack);
            } else {
              return scope.showWarning(scope.warningEnum.alreadySelectedDocumentType);
            }
          }
          _.each(option.documents, function (opt) {
            opt.selected = 0;
          });
          option.isSelected = true;
        }
        scope.updateSelectionWarnings();
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

      // reduce all the options of all questions in only one list, but each
      // answer is tagged with its question
      scope.allOptions = _.reduce(scope.election.questions_data, function(memo, question) {
        var taggedAnswers = _.map(question.answers, function (answer) {
          answer.category = question.question;
          answer.title = answer.value;
          if (answer.selected === undefined) {
            answer.selected = -1;
          }
          if (answer.urls.length > 0 && answer.urls[0].url &&
            answer.urls[0].url.indexOf("Android") >= -1)
          {
            // FIXME show in android viewer so that it works fine in the
            // Podemos app for now
            answer.urls[0].url = "https://docs.google.com/viewer?url=" + encodeURIComponent(answer.urls[0].url);
          }
          return answer;
        });
        return _.union(memo, taggedAnswers);
      }, []);

      // group answers by value
      scope.groupedOptions = _.map(
        _.groupBy(scope.allOptions, "value"),
        function (group) {
          return {
            isOpen: false,
            isOpen2: false,
            isPack: group[0].isPack,
            sortOrder: group[0].sort_order,
            isSelected: $filter("avbHasSelectedOptions")(group),
            title: group[0].value,
            details: group[0].details,
            includes: _.pluck(group, 'category').join(", "),
            documents: group
          };
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
      scope.updateSelectionWarnings = function () {
        scope.shownWarning  = "";
        if (scope.numSelectedOptions() === scope.election.max) {
          scope.shownWarning = scope.warningEnum.maxSelectedLimitReached;
        }
      };
      scope.updateSelectionWarnings();
    };

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avBooth/drafts-election-screen-directive/drafts-election-screen-directive.html'
    };
  });