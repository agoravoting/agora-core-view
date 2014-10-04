/*
 * Accordion Options directive.
 *
 * Lists the available options for a question, grouping options via their
 * category. Used by avbAvailableOptions directive.
 */
angular.module('avBooth')
  .directive('avbAccordionOptions', function() {

    var link = function(scope, element, attrs) {
        // get the categories
    };

    return {
      restrict: 'E',
      scope: true,
      link: link,
      templateUrl: 'avBooth/accordion-options-directive/accordion-options-directive.html'
    };
  });