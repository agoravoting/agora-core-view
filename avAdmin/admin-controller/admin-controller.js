angular.module('avAdmin').controller('AdminController',
  function(AdminPlugins, ConfigService, $scope, $i18next, $state, $stateParams, ElectionsApi, $compile) {
    var id = $stateParams.id;
    $scope.state = $state.current.name;
    $scope.current = null;

    // plugin stuff
    $scope.plugins = AdminPlugins.plugins;
    AdminPlugins.plugins.forEach(function(p) {
        var tpl = $compile( '<script type="text/ng-template" id="'+p.name+'"><div class="av-plugin-'+p.name+'"></div></script>' )($scope);
    });

    // state = admin.XXX
    $scope.shortst = $state.current.name.split(".")[1];

    function newElection() {
        var el = ElectionsApi.templateEl();
        $scope.current = el;
        ElectionsApi.setCurrent(el);

        return el;
    }

    if (id) {
        ElectionsApi.getElection(id)
            .then(function(el) {
                $scope.current = el;
                ElectionsApi.setCurrent(el);
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
