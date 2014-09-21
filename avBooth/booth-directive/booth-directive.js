angular.module('avBooth')
  .directive('avBooth', function($resource) {
    // possible values of the election status scope variable
    var statusEnum = {
      receiving: 0,
      loaded: 1,
      errorLoading: 2
    };

    // similar to a "directive controller"
    function link(scope, element, attrs) {
      // init scope vars
      angular.extend(scope, {
        election: null,
        status: statusEnum.receiving,
        statusEnum: statusEnum
      });

      // load election on background
      $resource(scope.electionUrl, {}, {'query': {method: 'GET'}})
        .query({electionId: scope.electionUrl})
        .$promise
        // on success
        .then(function(value) {
          scope.election = value;
          scope.status = statusEnum.loaded;
        },
        // on error
        function (error) {
          scope.status = statusEnum.errorLoading;
        });
    }

    return {
      restrict: 'E',
      scope: {
        electionUrl: '@electionUrl',
        config: '@config'
      },
      link: link,
      templateUrl: 'avBooth/booth-directive/booth-directive.html'
    };
  });