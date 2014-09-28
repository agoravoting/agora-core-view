/*
 * Directive that shows a detailed selected option.
 */
angular.module('avBooth')
  .directive('avbDetailedSelectedOption', function() {
    return {
      restrict: 'E',
      templateUrl: 'avBooth/detailed-selected-option-directive/detailed-selected-option-directive.html'
    };
  });