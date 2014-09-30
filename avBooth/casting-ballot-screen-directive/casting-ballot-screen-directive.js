/*
 * Casting Ballot Screen directive.
 *
 * Shown while the ballot is being encrypted and sent.
 */
angular.module('avBooth')
  .directive('avbCastingBallotScreen', function($i18next) {

    function link(scope, element, attrs) {
      // moves the title on top of the busy indicator
      scope.updateTitle = function(title) {
        var titleEl = element.find(".avb-busy-title").html(title);

        // set margin-top
        var marginTop = - titleEl.height() - 45;
        var marginLeft = - titleEl.width()/2;
        titleEl.attr("style", "margin-top: " + marginTop + "px; margin-left: " + marginLeft + "px");
      };

      scope.updateTitle($i18next(
        "avBooth.statusEncryptingQuestion",
        {questionNum: 1, percentage: 50}));
      scope.percentCompleted = 50;
    }

    return {
      restrict: 'E',
      link: link,
      templateUrl: 'avBooth/casting-ballot-screen-directive/casting-ballot-screen-directive.html'
    };
  });