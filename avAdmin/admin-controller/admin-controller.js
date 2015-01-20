angular.module('avAdmin').controller('AdminController',
  function($scope, $state, $stateParams, ElectionsApi) {
    $scope.state = $state.current.name;

    if ($scope.state === 'admin.newelection') {
        $scope.election = {questions: []};
    } else if ($scope.state === 'admin.editelection') {
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
  }
);
