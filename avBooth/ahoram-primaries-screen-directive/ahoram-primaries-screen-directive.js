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
          _.each(scope.options, function (element) {
            if (element.selected > option.selected) {
              element.selected -= 1;
            }
          });
          elIsAlcaldable = (element.category !== element.categoryUnified && element.selected === 0);

          if (elIsAlcaldable) {
            scope.blankVote.selected = 0;
          }
          option.selected = -1;
        } else {
          var numSelected = scope.numSelectedOptions();
          var numSelected2 = scope.numSelectedOptions2();
          var alcaldableSelected = (numSelected === numSelected2);
          elIsAlcaldable = (element.category !== element.categoryUnified);
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