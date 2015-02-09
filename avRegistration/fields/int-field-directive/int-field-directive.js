angular.module('avRegistration')
  .directive('avrIntField', function($state) {
    return {
      restrict: 'AE',
      scope: true,
      templateUrl: 'avRegistration/fields/int-field-directive/int-field-directive.html'
    };
  });
