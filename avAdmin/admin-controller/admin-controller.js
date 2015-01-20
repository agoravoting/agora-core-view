angular.module('avAdmin').controller('AdminController',
  function($scope, $state, $stateParams, ElectionsApi) {
    $scope.state = $state.current.name;
    $scope.current = { questions: []};
  }
);
