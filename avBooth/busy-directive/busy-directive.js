angular.module('avBooth')
  .directive('avBusy', function($resource, $window) {

    function link(scope, element, attrs) {
      scope.onResize = function() {
        console.log("resizing!");
        var title = element.find(".avb-busy-title");

        // set margin-top
        var marginTop = - title.height() - 45;
        var marginLeft = - title.width()/2;
        title.attr("style", "margin-top: " + marginTop + "px; margin-left: " + marginLeft + "px");
      };
      scope.onResize();
    }
    return {
      restrict: 'E',
      scope: {},
      link: link,
      transclude: true,
      templateUrl: 'avBooth/busy-directive/busy-directive.html'
    };
  });