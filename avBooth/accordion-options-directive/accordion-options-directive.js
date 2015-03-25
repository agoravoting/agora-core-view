/*
 * Accordion Options directive.
 *
 * Lists the available options for a question, grouping options via their
 * category. Used by avbAvailableOptions directive.
 */
angular.module('avBooth')
  .directive('avbAccordionOptions', function() {

    var link = function(scope, element, attrs) {
      // group by category
      _.each(scope.options, function (opt) {
        if (scope.layout === 'ahoram-primaries') {
          opt.categoryUnified = opt.category.replace(/^alcaldable:/, "");
        } else {
          opt.categoryUnified = opt.category;
        }
      });

      var categories = _.groupBy(scope.options, "categoryUnified");

      // convert this associative array to a list of objects with title and
      // options attributes
      scope.categories = _.map(_.pairs(categories), function(pair) {
        var i = -1;
        var title = pair[0];
        var answers = pair[1];

        if (scope.layout !== 'ahoram-primaries' || title === 'Candidaturas sin agrupar')
        {
          // randomize orden inside the category
          // we can't just sample the groupedOptions list because we need to
          // 1. use the same list object
          // 2. generate a specific ordering for all the options
          var shuffledNumbers = _.shuffle(_.map(answers, function () { i += 1; return i;}));
          // map different sort orders
          var shuffledAnswers = _.map(shuffledNumbers, function (index) { return answers[index].sort_order;});
          // now, assign
          _.each(answers, function (opt, index) { opt.sort_order = shuffledAnswers[index];});
          answers.sort(function (item1, item2) { return item1.sort_order - item2.sort_order; });
        } else {
          answers.sort(function (item1, item2) { return item1.sort_order - item2.sort_order; });
        }

        return {
          title: title,
          options: answers,
          isOpen: false
        };
      });

      scope.selectAll = function(category) {

        // if has alcaldable
        var addAlcaldable = 0;

        // if there's no alcaldable in the list
        if (category.options[0].category === category.options[0].categoryUnified) {
          addAlcaldable = 1;

          // do not change alcaldable
          _.each(scope.options, function (el) {
            if (el.selected > 0) {
              el.selected = -1;
            }
          });

        // if there is an alcaldable in the list
        } else {
          // deselect previous alcaldable too
          _.each(scope.options, function (el) {
            el.selected = -1;
          });
        }

        _.each(category.options, function (el, index) {
          el.selected = index + addAlcaldable;
        });
      };


      scope.numSelectedOptions = function () {
        return _.filter(
          scope.options,
          function (element) {
            return element.selected > -1 || element.isSelected === true;
          }).length;
      };

      scope.blankVote = _.filter(
        scope.options,
        function (el) {
          return (el.category === "Voto en blanco a la alcaldía");
        })[0];

      // doesn't count the first option which implies a blank vote in the first "round/question"
      scope.numSelectedOptions2 = function () {
        return _.filter(
          scope.options,
          function (element) {
            return (element.selected > -1 || element.isSelected === true) && element.id !== 0;
          }).length;
      };

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
    };

    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avBooth/accordion-options-directive/accordion-options-directive.html'
    };
  });