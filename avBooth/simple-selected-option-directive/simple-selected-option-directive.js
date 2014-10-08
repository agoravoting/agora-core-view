/*
 * Directive that shows a simple selected option.
 */
angular.module('avBooth')
  .directive('avbSimpleSelectedOption', function() {
    return {
      restrict: 'E',
      templateUrl: 'avBooth/simple-selected-option-directive/simple-selected-option-directive.html'
    };
  });