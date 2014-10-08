/*
 * Directive that shows an accordion option.
 */
angular.module('avBooth')
  .directive('avbAccordionOption', function() {
    return {
      restrict: 'E',
      templateUrl: 'avBooth/accordion-option-directive/accordion-option-directive.html'
    };
  });