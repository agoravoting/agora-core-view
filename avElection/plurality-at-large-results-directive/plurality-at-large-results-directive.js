/**
 * Shows the results of a specific question in an election, when the question
 * is of show with the plurality at large layout
 */
angular.module('avElection')
  .directive('avPluralityAtLargeResults', function() {
    // works like a controller
    function link(scope, element, attrs) {

      /*
       * Parses and initializes the election data
       */
      function initData() {
        // copy questions before sort
        scope.question = angular.copy(scope.question);
        scope.question.answers.sort(function(answer, answer2) {
          // if one is a winner, then that one goes first
          if (answer.is_winner && !answer2.is_winner) {
            return -1;
          } else if (!answer.is_winner && answer2.is_winner) {
            return 1;
          } else if (answer.is_winner && answer2.is_winner) {
            // if both are winners, then try sort by winner position
            var winDiff = answer.winner_position - answer2.winner_position;
            if (winDiff !== 0) {
              return winDiff;
            }
          }

          // if they have the same position, sort by totals
          return answer2.total_votes - answer.total_votes;
        });
      }
      initData();

      /*
       * Given a number, adds dots every three digits.
       *
       * Example:
       *
       *    addDotsToIntNumber(1234567) --> "1.234.567"
       */
      scope.addDotsToIntNumber = function (number) {
        var number_str = number + "";
        var ret = "";
        for (var i = 0; i < number_str.length; i++) {
          var reverse = number_str.length - i;
          if ((reverse % 3 === 0) && reverse > 0 && i > 0) {
            ret = ret + ".";
          }
          ret = ret + number_str[i];
        }
        return ret;
      };

      /*
       * Returns the percentage of votes received by an answer. The base number
       * of the percentage that is used depends on the
       * "answer_total_votes_percentage" option in the question.
       */
      scope.percentVotes = function (answer, question) {
        // special case
        if (answer.total_votes === 0) {
          return "0.00%";
        }

        var base = question.totals.all_votes;
        if (answer.answer_total_votes_percentage === "over-valid-votes") {
          base = question.totals.valid_votes;
        }

        return (100*answer.total_votes / base).toFixed(2) + "%";
      };

      /*
       * Returns the winner position if its >= 0. Else, returns ""
       */
      scope.winnerPosition = function(answer) {
        if (answer.winner_position >= 0) {
          return answer.winner_position + 1;
        } else {
          return "";
        }
      };
    }
    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avElection/plurality-at-large-results-directive/plurality-at-large-results-directive.html'
    };
  });
