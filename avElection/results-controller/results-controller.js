/*
 * Shows the results of an election. Controls mainly the changing inner states
 * loading config, showing results, showing error if no result is found.
 */
angular.module('avElection').controller('ResultsController',
  function($state, $stateParams, $http, $scope, $i18next, ConfigService, InsideIframeService) {
    $state.go('election.results.loading');

    // get election config and check if they contain the results
    // TODO: change config to results
    $http.get(ConfigService.baseUrl + "election/" + $stateParams.id)
      .success(function(value) {
        if (value.payload.state !== "results_ok") {
          $state.go("election.results.error");
        }
        $scope.election = value.payload.configuration;
        $scope.results = angular.fromJson(value.payload.results);
        $scope.inside_iframe = InsideIframeService();
        $state.go("election.results.show");
      })
      // on error, like parse error or 404
      .error(function (error) {
        $state.go("election.results.error");
      });
  }
);