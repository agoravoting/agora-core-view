/**
 * Public lading page for an election
 */
angular.module('avElection')
  .directive('aveDefaultElection', function($state, $stateParams) {
    function link(scope, element, attrs) {
      scope.getShareLink = function() {
        if (!scope.election) {
          return "";
        }
        return "https://twitter.com/intent/tweet?text=" + encodeURIComponent(scope.election.presentation.share_text) + "&source=webclient";
      };
      scope.name = function () {
        return $state.current.name.replace("election.public.show.", "");
      };
      scope.pageName = $stateParams.name;
    }
    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avElection/layouts/default-election-directive/default-election-directive.html'
    };
  });
