/*
 * Multiquestion directive.
 *
 * Shows a question and its possible answers to the user.
 */
angular.module('avBooth')
  .directive('avMultiQuestion', function() {
    
    scope.question = scope.election.question;
    scope.answers = scope.election.answers;
    
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'avBooth/multiquestion-directive/multi-question-directive.html'
    };
  });