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
        var categories = _.groupBy(scope.options, "category");

        // convert this associative array to a list of objects with title and
        // options attributes
        scope.categories = _.map(_.pairs(categories), function(pair) {
          var i = -1;
          var title = pair[0];
          var answers = pair[1];

          if (scope.layout !== 'ahoram-primaries' || title === 'Candidaturas no agrupadas')
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
          }

          return {
            title: title,
            options: answers,
            isOpen: false
          };
        });
    };

    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avBooth/accordion-options-directive/accordion-options-directive.html'
    };
  });