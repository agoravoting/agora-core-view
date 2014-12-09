angular.module('avRegistration')
  .directive('avRegister', function() {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {

        // Example
        scope.fields = { 'fields': [
            {'name': 'name', 'type': 'text', 'required': false},
            {'name': 'email', 'type': 'text', 'required': true},
            {'name': 'password', 'type': 'password', 'required': true},
            {'name': 'phone', 'type': 'text', 'required': true}
        ]};
    }

    return {
      restrict: 'AE',
      scope: {
      },
      link: link,
      templateUrl: 'avRegistration/register-directive/register-directive.html'
    };
  });
