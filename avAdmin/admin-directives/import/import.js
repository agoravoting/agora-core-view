angular.module('avAdmin')
  .directive('avAdminImport', function() {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        scope.loading = false;
        scope.file = null;

        function selectFile() {
            document.querySelector("#importfile").click();
        }

        function uploadFile(element) {
            scope.loading = true;

            var f = element.files[0];
            scope.$apply(function() {
                scope.file = f;
            });

            // fake upload, TODO make it real
            console.log(f);
            setTimeout(function () { scope.$apply(function() { scope.loading = false; }); }, 3000);
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
