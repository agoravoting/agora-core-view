/*
 * Ballot locator screen directive.
 */
angular.module('avBooth')
  .directive('avVerifyResults',  function(ConfigService, $http, $i18next) {

    function link(scope, element, attrs) {
      $http.get(ConfigService.baseUrl + "election/" + scope.electionId)
        // on success
        .success(function(value) {
          scope.election = value.payload.configuration;
        });
    }

    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avElection/verify-results-directive/verify-results-directive.html'
    };
  });