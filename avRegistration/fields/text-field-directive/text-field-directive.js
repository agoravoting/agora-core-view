angular.module('avRegistration')
  .directive('avrTextField', function($state) {
    return {
      restrict: 'AE',
      scope: true,
      templateUrl: 'avRegistration/fields/text-field-directive/text-field-directive.html'
    };
  });
