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

      // questionNext calls to scope.next() if user selected enough options.
      // If not, then it flashes the #selectMoreOptsWarning div so that user
      // notices.
      scope.questionNext = function() {
        var origColor = $("#selectMoreOptsWarning").css("background-color");
        if (scope.numSelectedOptions() < scope.stateData.question.min) {
          var selector = $("#selectMoreOptsWarning");
          var color = selector.css("color");
          selector
            .css("background-color", "#d9534f")
            .css("color", "white")
            .fadeOut(0)
            .fadeIn(200, 'swing', function()
              {
                $("#selectMoreOptsWarning")
                  .css('background-color',"#FFFFFF")
                  .css('color', color);
              });
        } else {
          scope.next();
        }
      };
    };

    return {
      restrict: 'E',
      link: link,
      templateUrl: 'avBooth/multi-question-directive/multi-question-directive.html'
    };
  });