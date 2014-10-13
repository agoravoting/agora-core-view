/*
 * Directive that shows a draft option.
 *
 * There are two types of draft options: packs and normal.
 */
angular.module('avBooth')
  .directive('avbDraftOption', function() {
    return {
      restrict: 'AE',
      templateUrl: 'avBooth/draft-option-directive/draft-option-directive.html'
    };
  });