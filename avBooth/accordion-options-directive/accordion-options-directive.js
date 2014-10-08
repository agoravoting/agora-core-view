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
        var first = true;
        scope.categories = _.map(_.pairs(categories), function(pair) {
          var isOpen = (first === true);
          first = false;
          return {
            title: pair[0],
            options: pair[1],
            isOpen: isOpen
          };
        });
    };

    return {
      restrict: 'E',
      scope: true,
      link: link,
      templateUrl: 'avBooth/accordion-options-directive/accordion-options-directive.html'
    };
  });