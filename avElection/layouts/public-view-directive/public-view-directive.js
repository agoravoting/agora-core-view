/**
 * Shows the results of an election in a simple way
 */
angular.module('avElection')
  .directive('avePublicView', function($stateParams, $window, $http, ConfigService, $i18next) {
    function link(scope, element, attrs) {
      scope.fileDataHtml = null;
      scope.fileDataError = false;

      if (scope.name.endsWith(".pdf")) {
        $window.location.href = ConfigService.publicURL + scope.name;
        return;
      }

      $http.get(ConfigService.publicURL + scope.name)
        .success(function(value) {
          scope.fileDataHtml = value;
        })
        .error(function(value) {
          scope.fileDataError = true;
        });
    }
    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avElection/layouts/public-view-directive/public-view-directive.html'
    };
  });
