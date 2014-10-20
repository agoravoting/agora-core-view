/*
 * Directive that shows a draft option.
 */
angular.module('avBooth')
  .directive('avbDraftOption', function() {
    return {
      restrict: 'AE',
      templateUrl: 'avBooth/draft-option-directive/draft-option-directive.html'
    };
  });