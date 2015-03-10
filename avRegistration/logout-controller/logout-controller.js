angular.module('avRegistration').controller('LogoutController',
  function($scope, $stateParams, $filter, ConfigService, $i18next, $state, $cookies) {
    var authevent = $cookies.authevent;
    $cookies.user = '';
    $cookies.auth = '';
    $cookies.authevent = '';
    $cookies.userid = '';
    if (parseInt(authevent) === ConfigService.freeAuthId) {
        $state.go("admin.login");
    } else {
        $state.go("registration.login", {id: $cookies.authevent});
    }
  }
);
