/*
 * Directive that shows an accordion ahoram-primaries option.
 */
angular.module('avBooth')
  .directive('avbAhoramPrimariesOption', function() {
    return {
      restrict: 'AE',
      templateUrl: 'avBooth/ahoram-primaries-option-directive/ahoram-primaries-option-directive.html'
    };
  });