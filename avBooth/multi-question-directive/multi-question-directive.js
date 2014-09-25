/*
 * Multiquestion directive.
 *
 * Shows a question and its possible answers to the user.
 */
angular.module('avBooth')
  .directive('avMultiQuestion', function() {
    return {
      restrict: 'E',
      templateUrl: 'avBooth/multi-question-directive/multi-question-directive.html'
    };
  });