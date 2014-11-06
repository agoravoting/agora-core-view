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
      // answer is tagged with its question_slug (apart from the tag of the
      // category) This kind of list is good for filtering/searching
      scope.allOptions = _.reduce(scope.election.questions_data, function(memo, question) {
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
      templateUrl: 'avBooth/pcandidates-election-screen-directive/pcandidates-election-screen-directive.html'
    };
  });