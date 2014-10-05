/*
 * Directive that shows a draft selected option.
 *
 * There are two types of draft options: packs and normal.
 */
angular.module('avBooth')
  .directive('avbDraftSelectedOption', function() {
    return {
      restrict: 'E',
      templateUrl: 'avBooth/draft-selected-option-directive/draft-selected-option-directive.html'
    };
  });