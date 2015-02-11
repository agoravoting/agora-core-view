/*
 * Shows the public view of an election. Controls mainly the changing inner states
 * loading config, showing results, showing error if needed.
 */
angular.module('avElection').controller('PublicController',
  function($state, $stateParams, $http, $scope, $i18next, ConfigService, InsideIframeService) {
    $state.go('election.public.loading');

    var mapLayouts = {
      "": "default",
      "pcandidates-election": "default"
    };

    // get election config
    $http.get(ConfigService.baseUrl + "election/" + $stateParams.id)
      .success(function(value) {
        var mapping = {
          registered:  "election.public.show",
          created:     "election.public.show",
          started:     "election.public.show",
          stopped:     "election.public.show",
          doing_tally: "election.public.show",
          tally_ok:    "election.public.show",
          results_ok:  "election.public.results"
        };
        $scope.election = value.payload.configuration;
        $scope.layout = mapLayouts[$scope.election.layout];
        $scope.electionState = value.payload.state;
        $scope.results = angular.fromJson(value.payload.results);
        $scope.inside_iframe = InsideIframeService();
        $state.go(mapping[value.payload.state]);
      })
      // on error, like parse error or 404
      .error(function (error) {
        $state.go("election.public.error");
      });
  }
);