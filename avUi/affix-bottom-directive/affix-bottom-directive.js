/*
 * directive used to position an element always at the bottom, so that it's
 * always shown completely. There are two scenarios:
 * a) if the page has no scroll, we assume the element is shown, and do nothing
 * b) if the page has scroll, the bottom of the page is not completely (or at
 *    all) being shown, so we set the affixed element the class affix-bottom and
 *    make space for it giving some bottom margin in its parent element.
 */
angular.module('avUi')
  .directive('avAffixBottom', function($window) {
    var affixBottomClass = "affix-bottom";

    var checkPosition = function(instance, el, options) {

      var affix = false;
      if(document.body.scrollHeight > window.innerHeight) {
        affix = affixBottomClass;
      }

      if (instance.affixed === affix) {
        return;
      }
      console.log("checkPosition " + affix);

      instance.affixed = affix;

      if (!affix) {
        el.removeClass(affixBottomClass);
        $(el).parent().css("margin-bottom", instance.defaultBottomMargin);
      } else {
        el.addClass(affixBottomClass);

        // add bottom-margin automatically
        $(el).parent().css("margin-bottom", $(el).height());
      }

    };

    return {
      restrict: 'EAC',
      link: function(scope, iElement, iAttrs) {
        var instance = {
          affixed: false,
          defaultBottomMargin: iElement.css("margin-bottom")
        };

        checkPosition(instance, iElement, iAttrs);

        angular.element($window).bind('resize', function() {
          checkPosition(instance, iElement, iAttrs);
        });

      }
    };

  });
