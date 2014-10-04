/*
 * Directive that shows an accordion selected option.
 */
angular.module('avBooth')
  .directive('avbAccordionSelectedOption', function() {
    return {
      restrict: 'E',
      templateUrl: 'avBooth/accordion-selected-option-directive/accordion-selected-option-directive.html'
    };
  });