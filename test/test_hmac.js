/*
 * Here we define the test hmac controller, that allows you to test that
 * you are correctly generating the urls.
 */
angular.module('avTest', []);

angular.module('avTest', [])
  .controller('TestHmacController', function($scope, $stateParams, HmacService) {
    $scope.hmac = $stateParams.hmac;
    $scope.message = $stateParams.message;
    $scope.key = $stateParams.key;
    $scope.calculatedHmac = HmacService.hmac($stateParams.key,
                                             $stateParams.message);
    $scope.hmacIsValid = HmacService.checkHmac($stateParams.key,
                                               $stateParams.message,
                                               $stateParams.hmac);
  });
