angular.module('avRegistration')
  .directive('avLogin', function() {
    // we use it as something similar to a controller here
    function link(scope, element, attrs, location) {

        scope.forgotPassword = function() {
            console.log('forgotPassword');
        };
    }
    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avRegistration/login-directive/login-directive.html'
    };
  });
