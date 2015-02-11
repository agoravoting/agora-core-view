/**
 * Shows the results of an election in a simple way
 */
angular.module('avElection')
  .directive('aveDefaultElection', function() {
    function link(scope, element, attrs) {
      scope.getShareLink = function() {
        return "https://twitter.com/intent/tweet?text=" + encodeURIComponent(scope.election.presentation.share_text) + "&source=webclient";
      };
    }
    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avElection/layouts/default-election-directive/default-election-directive.html'
    };
  });
