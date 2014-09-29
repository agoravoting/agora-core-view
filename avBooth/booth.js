angular.module('avBooth', ['ui.bootstrap','ui.utils','ui.router','ngAnimate']);

angular.module('avBooth').config(function($stateProvider) {
    /* Add New States Above */
});

angular.module('avBooth').controller('BoothController',
  function($scope, $stateParams, $filter, ConfigService, $i18next) {

    $scope.electionId = $stateParams.id;
    $scope.hmacHash = $stateParams.hmac;
    $scope.hmacMessage = $stateParams.message;    
    $scope.baseUrl = ConfigService.baseUrl;
    $scope.contact = ConfigService.contact;
    $scope.config = $filter('json')(ConfigService);

    // checks that the general format of the input data (hmac hash & message)
    // is valid
    $scope.checkElectionUrl = function () {
      var hashFormat = /^[0-9a-f]{64}$/;
      var error = $i18next("avBooth.errorElectionUrl");

      if (!hashFormat.test($scope.hmacHash) ||
        $.type($scope.hmacMessage) !== "string")
      {
        return error;
      }

      var splitMessage = $scope.hmacMessage.split(":");

      if (splitMessage.length !== 3 ||
        !hashFormat.test(splitMessage[0]) ||
        isNaN(parseInt(splitMessage[1])) ||
        isNaN(parseInt(splitMessage[2])))
      {
          return error;
      }
      return null;
    };
});
