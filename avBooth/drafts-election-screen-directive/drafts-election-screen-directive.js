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
  .directive('avbDraftsElectionScreen', function($i18next) {

    var link = function(scope, element, attrs) {
      scope.warningEnum = {
        packAlreadySelected: "packAlreadySelected",
        optionInCategoryAlreadySelected: "optionInCategoryAlreadySelected",
        cantSelectPackOptionAlreadySelected: "cantSelectPackOptionAlreadySelected"
      };

      scope.stateData.affixIsSet = false;
      scope.stateData.affixDropDownShown = false;

      // reduce all the options of all questions in only one list, but each
      // answer is tagged with its question
      scope.allOptions = _.reduce(scope.election.questions, function(memo, question) {
        var taggedAnswers = _.map(question.answers, function (answer) {
          answer.category = question.description;
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
            selected: selected,
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
    };

    return {
      restrict: 'E',
      link: link,
      templateUrl: 'avBooth/drafts-election-screen-directive/drafts-election-screen-directive.html'
    };
  });