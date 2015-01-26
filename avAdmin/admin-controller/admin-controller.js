angular.module('avAdmin').controller('AdminController',
  function($scope, $state, $stateParams, ElectionsApi) {
    var id = $stateParams.id;
    $scope.state = $state.current.name;
  }
);
