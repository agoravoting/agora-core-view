/*
 * Directive that shows an option with hidden but expandable details.
 */
angular.module('avBooth')
  .directive('avbDetailSelectedOption', function() {

    var link = function(scope, element, attrs) {
      scope.isOpen2 = false;
    };
    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avBooth/detail-selected-option-directive/detail-selected-option-directive.html'
    };
  });