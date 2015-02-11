/**
 * Shows the results of an election in a simple way
 */
angular.module('avElection')
  .directive('avePublicView', function($stateParams, $window, $http, ConfigService, $i18next) {
    function link(scope, element, attrs) {
      scope.name = $stateParams.name;
      scope.election = null;
      scope.fileDataHtml = null;
      scope.fileDataError = false;

      scope.getShareLink = function() {
        return "https://twitter.com/intent/tweet?text=" + encodeURIComponent(scope.election.presentation.share_text) + "&source=webclient";
      };

      if (scope.name.endsWith(".pdf")) {
        $window.location.href = ConfigService.publicURL + scope.name;
        return;
      }

      $http.get(ConfigService.baseUrl + "election/" + $stateParams.id)
        .success(function(value) {
          scope.election = value.payload.configuration;
        });

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
      scope: true,
      link: link,
      templateUrl: 'avElection/layouts/public-view-directive/public-view-directive.html'
    };
  });
