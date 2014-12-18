angular.module('avAdmin')
  .directive('avElectionForm', function() {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        if (!scope.election) {
            scope.election = {questions: []};
        }
    }

    return {
      restrict: 'AE',
      scope: {
        election: '=election'
      },
      link: link,
      templateUrl: 'avAdmin/election-form-directive/election-form-directive.html'
    };
  });
