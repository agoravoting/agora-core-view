/*
 * Ballot locator screen directive.
 */
angular.module('avBooth')
  .directive('avVerifyResults',  function(ConfigService) {

    function link(scope, element, attrs) {
      scope.publicURL = ConfigService.publicURL;
      scope.noHeader = (attrs.noHeader !== undefined);
    }

    return {
      restrict: 'AE',
      link: link,
      scope: true,
      templateUrl: 'avElection/verify-results-directive/verify-results-directive.html'
    };
  });