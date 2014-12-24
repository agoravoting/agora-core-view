angular.module('avAdmin').controller('EditElectionController',
  function($scope, $stateParams, $filter, ConfigService, $i18next, ElectionsApi) {
    $scope.election = {questions: []};
    $scope.loading = true;


    var id = "FAKE ADMIN ID";
    var auth = "FAKE ADMIN AUTH";

    ElectionsApi.election($stateParams.id)
        .success(function(data) {
            $scope.loading = false;
            $scope.election = data;
        })
        .error(function(error) {
            $scope.loading = false;
            $scope.status = 'error: ' + error.message;
            //document.querySelector(".error").style.display = "block";
        });
  }
);
