/*
 * Directive that shows a detailed option.
 */
angular.module('avBooth')
  .directive('avbDetailedOption', function() {
    return {
      restrict: 'E',
      templateUrl: 'avBooth/detailed-option-directive/detailed-option-directive.html'
    };
  });