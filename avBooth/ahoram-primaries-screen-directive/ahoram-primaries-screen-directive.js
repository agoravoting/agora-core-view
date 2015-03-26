/*
 * Ahora madrid complex primaries directive.
 *
 * Shows a question and its possible answers to the user.
 */
angular.module('avBooth')
  .directive('avbAhoramPrimariesScreen', function() {

    var link = function(scope, element, attrs) {
      scope.stateData.affixIsSet = false;
      scope.stateData.affixDropDownShown = false;
      scope.hideSelection = false;

      scope.numSelectedOptions = function () {
        return _.filter(
          scope.stateData.question.answers,
          function (element) {
            return element.selected > -1 || element.isSelected === true;
          }).length;
      };

      scope.blankVote = _.filter(
        scope.stateData.question.answers,
        function (el) {
          return (el.category === "Voto en blanco a la alcaldía");
        })[0];

      // doesn't count the first option which implies a blank vote in the first "round/question"
      scope.numSelectedOptions2 = function () {
        return _.filter(
          scope.stateData.question.answers,
          function (element) {
            return (element.selected > -1 || element.isSelected === true) && element.id !== 0;
          }).length;
      };

      // select the blank alcaldia if no selection, because no selection is
      // ambiguous
      if (scope.numSelectedOptions() === 0)  {
        scope.blankVote.selected = 0;
      }

      scope.toggleSelectItem2 = function(option) {
        var elIsAlcaldable;
        if (option.selected > -1) {
          elIsAlcaldable = (option.category !== option.categoryUnified && option.selected === 0);
          _.each(scope.options, function (element) {
            if (element.selected > option.selected) {
              element.selected -= 1;
            }
          });

          if (elIsAlcaldable) {
            scope.blankVote.selected = 0;
          }
          option.selected = -1;
        } else {
          var numSelected = scope.numSelectedOptions();
          var numSelected2 = scope.numSelectedOptions2();
          var alcaldableSelected = (numSelected === numSelected2);
          elIsAlcaldable = (option.category !== option.categoryUnified);
          var max = parseInt(scope.max,10);

          if (elIsAlcaldable) {
            if (!alcaldableSelected) {
              option.selected = 0;
              scope.blankVote.selected = -1;
            } else {

              // can't select more, flash info
              if (numSelected === parseInt(scope.max,10)) {
                $("#maxSelectedLimitReached").flash();
                return;
              }

              // put first in the list of concejalias as requested by client
              _.each(scope.options, function(el) {
                if (el.selected > 0) {
                  el.selected += 1;
                }
              });
              option.selected = 1;
            }
          } else {
            // can't select more, flash info
            if (numSelected === parseInt(scope.max,10)) {
              $("#maxSelectedLimitReached").flash();
              return;
            }

            option.selected = numSelected;
          }

        }
      };

      var question = scope.stateData.question;

      if (question.randomize_answer_order) {
        // we can't just sample the groupedOptions list because we need to
        // 1. use the same list object
        // 2. generate a specific ordering for all the options
        var i = -1;
        var answers = question.answers;
        var shuffledNumbers = _.shuffle(_.map(answers, function () { i += 1; return i;}));
        // map different sort orders
        var shuffledAnswers = _.map(shuffledNumbers, function (index) { return answers[index].sort_order;});
        // now, assign
        _.each(answers, function (opt, index) { opt.sort_order = shuffledAnswers[index];});
        answers.sort(function (item1, item2) { return item1.sort_order - item2.sort_order; });
        scope.stateData.question.answers = answers;
      }

      // questionNext calls to scope.next() if user selected enough options.
      // If not, then it flashes the #selectMoreOptsWarning div so that user
      // notices.
      scope.questionNext = function() {
        if (scope.numSelectedOptions() < scope.stateData.question.min) {
          $("#selectMoreOptsWarning").flash();
          return;
        }
        scope.next();
      };
    };

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avBooth/ahoram-primaries-screen-directive/ahoram-primaries-screen-directive.html'
    };
  });