angular.module('avAdmin')
  .directive('avAdminQuestion', function() {
    // we use it as something similar to a controller here
    function link(scope, element, attrs) {
      scope.questionIndex = function() {
        return scope.$index;
      };

      function scrollToCurrent() {
        setTimeout(function() {
          $("html,body").animate({scrollTop: $(element).offset().top - 250}, 400);
        }, 200);
      }

      // scroll and show on creation
      if (scope.q.active) {
        scrollToCurrent();
      }

      scope.$watch("q.active", function (newValue, oldValue) {
        if (newValue === true) {
          scrollToCurrent();
        }
      });
    }

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avAdmin/admin-directives/question/question.html'
    };
  });
