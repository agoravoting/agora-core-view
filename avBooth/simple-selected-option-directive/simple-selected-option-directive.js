/*
 * Directive that shows a simple selected option.
 */
angular.module('avBooth')
  .directive('avbSimpleSelectedOption', function() {
    return {
      restrict: 'AE',
      templateUrl: 'avBooth/simple-selected-option-directive/simple-selected-option-directive.html'
    };
  });