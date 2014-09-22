angular.module('avBooth')
  .directive('avBooth', function($resource, $location) {
    // possible values of the election status scope variable
    var statusEnum = {
      receivingElection: 'receivingElection',
      loadedElection: 'loadedElection',
      errorLoadingElection: 'errorLoadingElection'
    };

    // similar to a "directive controller"
    function link(scope, element, attrs) {

      // override status if in debug mode and it's provided via query param
      function setStatus(newStatus) {
        if (!scope.config.debug || $location.search()['status'] == null) {
          console.log("setting status to " + newStatus);
          scope.status = newStatus;
        } else {
          console.log("status override: not setting status to " + newStatus);
          scope.status = $location.search()['status'];
        }
      }

      // init scope vars
      angular.extend(scope, {
        election: null,
        setStatus: setStatus,
        statusEnum: statusEnum,
        // convert config to JSON
        config: angular.fromJson(scope.configStr)
      });
      setStatus(statusEnum.receivingElection);

      // load election on background
      $resource(scope.electionUrl, {}, {'get': {method: 'GET'}})
        .get()
        .$promise
        // on success
        .then(function(value) {
          scope.election = value;
          scope.setStatus(statusEnum.loadedElection);
        },
        // on error
        function (error) {
          scope.setStatus(statusEnum.errorLoadingElection);
        });
    }


    return {
      restrict: 'E',
      scope: {
        electionUrl: '@electionUrl',
        configStr: '@config'
      },
      link: link,
      templateUrl: 'avBooth/booth-directive/booth-directive.html'
    };
  });