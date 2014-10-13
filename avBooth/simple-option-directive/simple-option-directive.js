/*
 * Directive that shows a simple option.
 */
angular.module('avBooth')
  .directive('avbSimpleOption', function() {
    return {
      restrict: 'AE',
      templateUrl: 'avBooth/simple-option-directive/simple-option-directive.html'
    };
  });