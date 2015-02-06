angular.module('avAdmin').controller('AdminController',
  function($scope, $i18next, $state, $stateParams, ElectionsApi) {
    var id = $stateParams.id;
    $scope.state = $state.current.name;
    $scope.current = null;

    function newElection() {
        var el = {
            title: $i18next('avAdmin.sidebar.newel'),
            census: {
                voters: [],
                census:'open',
                extra_fields: [
                    {
                    "name": "email",
                    "type": "text",
                    "required": true,
                    "min": 2,
                    "max": 200,
                    "required_on_authentication": true
                    }
                ]
            }
        };
        $scope.current = el;
        ElectionsApi.currentElection = el;

        return el;
    }

    if (id) {
        ElectionsApi.getElection(id)
            .then(function(el) {
                $scope.current = el;
                ElectionsApi.currentElection = el;
            });
    }

    if ($scope.state === 'admin.new') {
        // New election
        newElection();
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
            if (!current.title) {
                current = newElection();
            }
            $scope.current = current;
        }
    } else {
        $scope.sidebarlinks = [];
    }
  }
);
