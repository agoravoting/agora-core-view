/*
 * Directive that shows an option with a circled image.
 */
angular.module('avBooth')
  .directive('avbDetailOption', function() {

    var link = function(scope, element, attrs) {
      scope.isOpen = false;
    };
    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avBooth/detail-option-directive/detail-option-directive.html'
    };
  });