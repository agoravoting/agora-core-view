/*
 * directive used to position an element always at the bottom, so that it's
 * always shown completely. There are two scenarios:
 * a) if the page has no scroll, we assume the element is shown, and do nothing
 * b) if the page has scroll, the bottom of the page is not completely (or at
 *    all) being shown, so we set the affixed element the class affix-bottom and
 *    make space for it giving some bottom margin in its parent element.
 */
angular.module('avUi')
  .directive('avAffixBottom', function($window, $timeout) {
    var affixBottomClass = "affix-bottom";

    var checkPosition = function(instance, el, options) {

      var affix = false;
      var elHeight = $(el).height();

      if (document.body.scrollHeight + elHeight > window.innerHeight) {
        affix = affixBottomClass;
      }

      if (instance.affixed === affix) {
        return;
      }

      instance.affix = affix;

      if (!affix) {
        el.removeClass(affixBottomClass);
        $(el).parent().css("margin-bottom", instance.defaultBottomMargin);
      } else {
        el.addClass(affixBottomClass);

        // add bottom-margin automatically
        $(el).parent().css("margin-bottom", elHeight + "px");
      }

    };

    return {
      restrict: 'EAC',
      link: function(scope, iElement, iAttrs) {
        // instance saves state between calls to checkPosition
        var instance = {
          affix: false,
          defaultBottomMargin: iElement.css("margin-bottom")
        };

        // timeout is used with callCheckPos so that we do not create too many
        // calls to checkPosition, at most one per 100ms
        var timeout;

        function callCheckPos() {
          timeout = $timeout(function() {
            $timeout.cancel(timeout);
            checkPosition(instance, iElement, iAttrs);
          }, 100);
        }
        callCheckPos();

        // watch for window resizes and element resizes too
        angular.element($window).on('resize', callCheckPos);
        angular.element(document.body).on('resize', callCheckPos);
        angular.element(iElement).on('resize', callCheckPos);
      }
    };

  });
