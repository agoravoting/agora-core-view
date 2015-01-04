angular.module('avAdmin').controller('EditElectionController',
  function($scope, $stateParams, $filter, ConfigService, $i18next, ElectionsApi) {
    $scope.election = {questions: []};
    $scope.loading = true;

    ElectionsApi.election($stateParams.id)
        .success(function(data) {
            $scope.election = ElectionsApi.parseElection(data);
            $scope.loading = false;
        })
        .error(function(error) {
            $scope.loading = false;
            $scope.status = 'error: ' + error.message;
        });
  }
);
