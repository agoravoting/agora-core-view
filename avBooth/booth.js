angular.module('avBooth', ['ui.bootstrap','ui.utils','ui.router','ngAnimate']);

angular.module('avBooth').config(function($stateProvider) {
    /* Add New States Above */
});

angular.module('avBooth').controller('BoothController',
  function($scope, $stateParams, $filter, ConfigService) {
    $scope.electionId = $stateParams.id;
    $scope.hmacHash = $stateParams.hmac;
    $scope.hmacMessage = $stateParams.message;    
    $scope.baseUrl = ConfigService.baseUrl;
    $scope.contact = ConfigService.contact;
    $scope.config = $filter('json')(ConfigService);
});
