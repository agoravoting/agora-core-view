/*
 * Busy indicator directive.
 *
 * Receives via transclude the text to show in the indicator, if any.
 */
angular.module('avBooth')
  .directive('avBusy', function($resource, $window) {

    function link(scope, element, attrs) {
      // moves the title on top of the busy indicator
      scope.updateTitle = function() {
        console.log("resizing!");
        var title = element.find(".avb-busy-title");

        // set margin-top
        var marginTop = - title.height() - 45;
        var marginLeft = - title.width()/2;
        title.attr("style", "margin-top: " + marginTop + "px; margin-left: " + marginLeft + "px");
      };

      scope.$watch(attrs.title, function() {
        scope.updateTitle();
      });

    }
    return {
      restrict: 'E',
      scope: {},
      link: link,
      transclude: true,
      templateUrl: 'avBooth/busy-directive/busy-directive.html'
    };
  });