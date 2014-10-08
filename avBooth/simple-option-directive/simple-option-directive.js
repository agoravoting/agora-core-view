/*
 * Directive that shows a simple option.
 */
angular.module('avBooth')
  .directive('avbSimpleOption', function() {
    return {
      restrict: 'E',
      templateUrl: 'avBooth/simple-option-directive/simple-option-directive.html'
    };
  });