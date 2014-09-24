/*
 * avCollapsing limits the default maximum height of an element by making it
 * collapsable if it exceeds the max-height of the selector.
 *  - if the element's height doesn't exceed its maximum height, the
 *    data-toggle-selector element will be set to hidden
 *  - if the element's height doesn't exceed its maximum height, the
 *    data-toggle-selector element will be removed the class "hidden".
 *  - if the data-toggle-selector element it contains is clicked, they will be
 *    added the class ".in".
 *  - if the element's height exceeds its max height and the toggle is not
 *    ".in", then it adds the ".collapsed" class to the element, and makes sure
 *    the data-toggle-selector element is not hidden.
 *  - it will watch the element and window resizes to see if the conditions
 *    change.
 */
angular.module('avUi')
  .directive('avCollapsing', function($window, $timeout) {
    var affixBottomClass = "affix-bottom";

    var checkCollapse = function(instance, el, options) {
      var maxHeight = angular.element(instance.maxHeightSelector).css("max-height");
      var jel = angular.element(el);
      var height = jel[0].scrollHeight;

      if (maxHeight.indexOf("px") === -1) {
        console.log("invalid non-pixels max-height for " + instance.maxHeightSelector);
        return;
      }

      maxHeight = parseInt(maxHeight.replace("px", ""));

      // make sure it's collapsed if it should
      if (height > maxHeight) {
        // already collapsed
        if (instance.isCollapsed) {
          return;
        }
        instance.isCollapsed = true;
        jel.addClass("collapsed");
        angular.element(instance.toggleSelector).removeClass("hidden in");

      // removed collapsed and hide toggle otherwise
      } else {
        // already not collapsed
        if (!instance.isCollapsed) {
          return;
        }
        instance.isCollapsed = false;
        jel.removeClass("collapsed");
        angular.element(instance.toggleSelector).addClass("hidden");
      }
    };

    var toggleCollapse = function(instance, el, options) {
      var jel = angular.element(el);

      // if it's collapsed, uncollapse
      if (instance.isCollapsed) {
        jel.removeClass("collapsed");
        angular.element(instance.toggleSelector).addClass("in");

      // collapse otherwise
      } else {
        jel.addClass("collapsed");
        angular.element(instance.toggleSelector).removeClass("in");
      }


      instance.isCollapsed = !instance.isCollapsed;
    };

    return {
      restrict: 'EAC',
      link: function(scope, iElement, iAttrs) {
        var instance = {
          isCollapsed: false,
          maxHeightSelector: iAttrs.avCollapsing,
          toggleSelector: iAttrs.toggleSelector
        };

        // timeout is used with callCheck so that we do not create too many
        // calls to checkPosition, at most one per 100ms
        var timeout;

        function callCheck() {
          timeout = $timeout(function() {
            $timeout.cancel(timeout);
            checkCollapse(instance, iElement, iAttrs);
          }, 100);
        }
        callCheck();


        function launchToggle() {
            toggleCollapse(instance, iElement, iAttrs);
        }

        // watch for window resizes and element resizes too
        angular.element($window).bind('resize', callCheck);
        angular.element(iElement).bind('resize', callCheck);

        // watch toggle's clicking
        angular.element(instance.toggleSelector).bind('click', launchToggle);
      }
    };

  });
