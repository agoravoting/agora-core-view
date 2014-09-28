/*
 * Multiquestion directive.
 *
 * Shows a question and its possible answers to the user.
 */
angular.module('avBooth')
  .directive('avbMultiQuestion', function() {

    var link = function(scope, element, attrs) {
      scope.numSelectedOptions = function () {
        return _.filter(
          scope.election.questions[scope.stateData.questionNum].answers,
          function (element) {
            return element.selected > -1;
          }).length;
      };
    };

    return {
      restrict: 'E',
      link: link,
      templateUrl: 'avBooth/multi-question-directive/multi-question-directive.html'
    };
  });