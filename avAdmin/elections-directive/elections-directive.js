angular.module('avAdmin')
  .directive('avElections', ['AuthApi', 'ElectionsApi', '$location', '$parse', '$state', function(AuthApi, ElectionsApi, $location, $parse, $state) {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
        // TODO make it real
        var adminid = 'admin-id';
        var admin = 'Ganemos Sevilla';
        var adminauth = 'HMAC';

        scope.register = {};

        scope.view = function(id, auth) {
            ElectionsApi.elections(id, auth)
                .success(function(data) {
                    if (data.status === "ok") {
                        scope.apply(data.elections);
                    } else {
                        scope.status = 'Not found';
                        document.querySelector(".error").style.display = "block";
                    }
                })
                .error(function(error) {
                    scope.status = 'Scan error: ' + error.message;
                    document.querySelector(".error").style.display = "block";
                });
        };

        scope.apply = function(elections) {
            scope.admin = admin;
            scope.elections = elections;
        };

        scope.view(adminid, adminauth);
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avAdmin/elections-directive/elections-directive.html'
    };
  }]);
