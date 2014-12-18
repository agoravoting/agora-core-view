angular.module('avAdmin').controller('NewElectionController',
  function($scope, $stateParams, $filter, ConfigService, $i18next) {
    $scope.election = {questions: []};
  }
);
