angular.module('avRegistration')
  .directive('avrCodeField', function($state) {
    return {
      restrict: 'AE',
      scope: true,
      templateUrl: 'avRegistration/fields/code-field-directive/code-field-directive.html'
    };
  });
