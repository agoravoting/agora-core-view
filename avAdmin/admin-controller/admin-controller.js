angular.module('avAdmin').controller('AdminController',
  function($scope, $state, $stateParams, ElectionsApi) {
    var id = $stateParams.id;
    $scope.state = $state.current.name;
    $scope.current = null;

    if (id) {
        ElectionsApi.getElection(id)
            .then(function(el) {
                $scope.current = el;
                ElectionsApi.currentElection = el;
            });
    }

    if ($scope.state === 'admin.new') {
        // New election
        var el = {title: 'New Election'};
        $scope.current = el;
        ElectionsApi.currentElection = el;
        $state.go("admin.basic");
    }

    var states =[ 'admin.dashboard', 'admin.basic', 'admin.questions', 'admin.census', 'admin.auth', 'admin.tally' ];
    if (states.indexOf($scope.state) >= 0) {
        $scope.sidebarlinks = [
            {name: 'basic', icon: 'university'},
            {name: 'questions', icon: 'question-circle'},
            {name: 'census', icon: 'users'},
            {name: 'auth', icon: 'unlock'},
            {name: 'tally', icon: 'pie-chart'},
        ];
        if (!id) {
            var current = ElectionsApi.currentElection;
            $scope.current = current;
        }
    } else {
        $scope.sidebarlinks = [];
    }
  }
);
