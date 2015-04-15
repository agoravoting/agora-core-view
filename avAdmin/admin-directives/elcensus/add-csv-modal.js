angular.module('avAdmin')
  .controller('AddCsvModal',
    function($scope, $modalInstance, election) {
      $scope.election = election;
      $scope.massiveef = "";
      $scope.ok = function () {
        $modalInstance.close($scope.massiveef);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    });
