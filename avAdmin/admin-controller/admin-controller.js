angular.module('avAdmin').controller('AdminController',
  function(ConfigService, $scope, $i18next, $state, $stateParams, ElectionsApi) {
    var id = $stateParams.id;
    $scope.state = $state.current.name;
    $scope.current = null;

    function newElection() {
        var el = {
            title: $i18next('avAdmin.sidebar.newel'),
            start_date: "2015-01-27T16:00:00.001",
            end_date: "2015-01-27T16:00:00.001",
            authorities: ConfigService.authorities,
            director: ConfigService.director,
            presentation: {
                theme: 'default',
                share_text: '',
                urls: [],
                theme_css: ''
            },
            layout: 'simple',
            census: {
                voters: [],
                auth_method: 'email',
                census:'open',
                extra_fields: [ ],
                config: {
                    "msg": $i18next('avAdmin.auth.emaildef'),
                    "subject": $i18next('avAdmin.auth.emailsub')
                }
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

    var states =[ 'admin.dashboard', 'admin.basic', 'admin.questions', 'admin.census', 'admin.auth', 'admin.tally', 'admin.create'];
    if (states.indexOf($scope.state) >= 0) {
        $scope.sidebarlinks = [
            {name: 'basic', icon: 'university'},
            {name: 'questions', icon: 'question-circle'},
            {name: 'census', icon: 'users'},
            {name: 'auth', icon: 'unlock'},
            //{name: 'tally', icon: 'pie-chart'},
        ];

        if (!id) {
            $scope.sidebarlinks.push({name: 'create', icon: 'rocket'});
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
