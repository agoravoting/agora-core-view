/*
 * Review screen directive.
 *
 * Shows the steps to the user.
 */
angular.module('avBooth')
  .directive('avbReviewScreen', function() {

    var link = function(scope, element, attrs) {
      scope.audit = function() {
        scope.stateData.auditClicked = true;
        scope.next();
      };
    };
    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avBooth/review-screen-directive/review-screen-directive.html'
    };
  });