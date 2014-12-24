angular.module('avAdmin')
  .directive('avElections', ['AuthApi', 'ElectionsApi', '$location', '$parse', '$state', function(AuthApi, ElectionsApi, $location, $parse, $state) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        scope.register = {};
        scope.elections = [];
        scope.loading = true;

        scope.view = function() {
            AuthApi.electionsIds()
                .success(function(data) {
                    //scope.loading = data.perms.length;

                    // here we've the elections id, then we need to ask to
                    // ElectionsApi for each election and load it.
                    data.perms.forEach(function (perm) {
                        //ElectionsApi.election(perm.object_id)
                        //.success(function(d) {
                        //    scope.elections.push(d);
                        //    scope.loading -= 1;
                        //});
                    });
                });

            ElectionsApi.elections().success(function(data) {
                scope.elections = data.elections;
                scope.loading = false;
            });
        };

        scope.view();
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/elections-directive/elections-directive.html'
    };
  }]);
