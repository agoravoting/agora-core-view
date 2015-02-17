angular.module('avAdmin')
  .directive('avAdminImport', function($window, ElectionsApi, $state, ImportService) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        scope.loading = false;
        scope.file = null;
        scope.parsed = null;

        function selectFile() {
            document.querySelector("#importfile").click();
        }

        function uploadFile(element) {
            scope.loading = true;

            var f = element.files[0];
            scope.$apply(function() {
                scope.file = f;
            });

            $window.Papa.parse(f, {
                complete: function(results) {
                    scope.loading = false;
                    var els = ImportService(results.data);
                    // only works for one election, the first
                    ElectionsApi.currentElections = els;
                    ElectionsApi.setCurrent(els[0]);
                    ElectionsApi.newElection = true;
                    $state.go("admin.create");
                },
            });
        }

        angular.extend(scope, {
          selectFile: selectFile,
          uploadFile: uploadFile
        });
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/admin-directives/import/import.html'
    };
  });
