angular.module('avRegistration')
  .directive('avrTelField', function($state) {
    return {
      restrict: 'AE',
      scope: true,
      templateUrl: 'avRegistration/fields/tel-field-directive/tel-field-directive.html'
    };
  });
