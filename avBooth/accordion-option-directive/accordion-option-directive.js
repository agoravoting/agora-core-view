/*
 * Directive that shows an accordion option.
 */
angular.module('avBooth')
  .directive('avbAccordionOption', function() {
    return {
      restrict: 'AE',
      templateUrl: 'avBooth/accordion-option-directive/accordion-option-directive.html'
    };
  });