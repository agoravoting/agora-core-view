/*
 * Ballot locator screen directive.
 */
angular.module('avBooth')
  .directive('avBallotLocatorScreen',  function(ConfigService, $http, $i18next) {

    function link(scope, element, attrs) {
      scope.locator = "";
      scope.locatorStatus = "";
      scope.ballot = "";
      scope.searchEnabled = true;


      scope.searchLocator = function() {
        scope.searchEnabled = false;
        scope.locatorStatus = $i18next("avBooth.locatorSearchingStatus");
        $http.get(ConfigService.baseUrl + "election/" + scope.electionId + "/hash/" + scope.locator)
          // on success
          .success(function(value) {
            scope.searchEnabled = true;
            scope.locatorStatus = $i18next("avBooth.locatorFoundStatus");
            scope.ballot = angular.toJson(value.payload);
          })
          // on error, like parse error or 404
          .error(function (error) {
            scope.searchEnabled = true;
            scope.ballot = "";
            scope.locatorStatus = $i18next("avBooth.locatorNotFoundStatus");


            scope.searchEnabled = true;
            scope.locatorStatus = $i18next("avBooth.locatorFoundStatus");
            scope.ballot = angular.toJson("yadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayada yadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayadayada yadayadayadayadayadayadayadayadayadayadayadayadayadayada");
          });
      };
    }

    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avBooth/ballot-locator-screen-directive/ballot-locator-screen-directive.html'
    };
  });