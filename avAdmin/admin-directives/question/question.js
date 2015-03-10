angular.module('avAdmin')
  .directive('avAdminQuestion', function() {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
      scope.questionIndex = function() {
        return scope.$index;
      };
    }

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avAdmin/admin-directives/question/question.html'
    };
  });
