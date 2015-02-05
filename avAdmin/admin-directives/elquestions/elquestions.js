angular.module('avAdmin')
  .directive('avAdminElquestions', ['$state', 'ElectionsApi', function($state, ElectionsApi) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        scope.election = ElectionsApi.currentElection;

        function save() {
            $state.go("admin.census");
        }

        angular.extend(scope, {
          saveQuestions: save,
        });
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-directives/elquestions/elquestions.html'
    };
  }]);
