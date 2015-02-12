/*
 * Shows the public view of an election. Controls mainly the changing inner states
 * loading config, showing results, showing error if needed.
 */
angular.module('avElection').controller('PublicController',
  function($state, $stateParams, $http, $scope, $i18next, ConfigService, InsideIframeService) {
    $state.go('election.public.loading');

    var mapLayouts = {
      "": "default",
      "simple": "default",
      "pcandidates-election": "default"
    };

    // get election config
    $http.get(ConfigService.baseUrl + "election/" + $stateParams.id)
      .success(function(value) {
        $scope.election = value.payload.configuration;
        $scope.layout = mapLayouts[$scope.election.layout];
        $scope.electionState = value.payload.state;
        $scope.statePrefix = "election.public.show";
        $scope.results = angular.fromJson(value.payload.results);
        $scope.inside_iframe = InsideIframeService();
        $state.go($scope.statePrefix);
      })
      // on error, like parse error or 404
      .error(function (error) {
        $state.go("election.public.error");
      });
  }
);