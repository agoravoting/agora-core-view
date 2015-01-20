/*
 * Ballot locator screen directive.
 */
angular.module('avBooth')
  .directive('avVerifyResults',  function(ConfigService, $http, $i18next) {

    function link(scope, element, attrs) {
      scope.electionState = 'loading';
      $http.get(ConfigService.baseUrl + "election/" + scope.electionId)
        // on success
        .success(function(value) {
          scope.election = value.payload.configuration;
          scope.electionState = value.payload.state;
        });
    }

    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avElection/verify-results-directive/verify-results-directive.html'
    };
  });