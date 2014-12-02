angular.module('avBooth', ['ui.bootstrap','ui.utils','ui.router','ngAnimate']);

angular.module('avBooth').config(function($stateProvider) {
    /* Add New States Above */
});

angular.module('avBooth').controller('BoothController',
  function($scope, $stateParams, $filter, ConfigService, $i18next, HmacService, InsideIframeService) {

    $scope.electionId = $stateParams.id;
    $scope.hmacHash = $stateParams.hmac || "";
    $scope.hmacMessage = $stateParams.message || "";
    $scope.baseUrl = ConfigService.baseUrl;
    $scope.voterId = "";
    $scope.config = $filter('json')(ConfigService);

    // checks that the general format of the input data (hmac hash & message)
    // is valid
    function checkElectionUrl() {
      if ($scope.hmacHash.length === 0 || InsideIframeService()) {
        return null;
      }
      var hashFormat = /^[0-9a-f]{64}$/;
      var error = $i18next("avBooth.errorElectionUrl");

      if (!hashFormat.test($scope.hmacHash) ||
        $.type($scope.hmacMessage) !== "string")
      {
        return error;
      }

      var splitHmac = $scope.hmacMessage.split(":");
      if (splitHmac.length !== 2) {
        return error;
      }

      var message = splitHmac[0];
      var timestamp = splitHmac[1];
      var splitMessage = message.split("-");

      if (splitMessage[0] !== "voter" ||
        !hashFormat.test(splitMessage[2]) ||
        isNaN(parseInt(splitMessage[1])) ||
        isNaN(parseInt(timestamp)))
      {
          return error;
      }

      $scope.voterId = splitMessage[2];

      return null;
    }

    checkElectionUrl();
    $scope.checkElectionUrl = checkElectionUrl;
});
