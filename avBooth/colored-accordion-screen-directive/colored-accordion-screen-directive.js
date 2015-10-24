/*
 * Colored accordion directive
 *
 * Shows a question grouped by category with the posibility of subcategory
 * using the name:
 *   - category
 *   - category > subcategory
 *
 * Options with support url equals to true will be shown in other color and
 * can be selected in group.
 */
angular.module('avBooth')
  .directive('avbColoredAccordionScreen', function() {

    var link = function(scope, element, attrs) {
        window.s = scope;

        var q = scope.stateData.question;
        var answers = q.answers;

        var categories = _.groupBy(answers, "category");

        scope.categories = _.map(_.pairs(categories), function(pair) {
          var i = -1;
          var title = pair[0];
          var answers = pair[1];

          return {
            title: title,
            options: answers,
            isOpen: (scope.folding_policy === "unfold-all")
          };
        });

        // getting subcat inside the corresponding cat
        // scope.categories has this structure:
        //
        // cat
        //  - option1
        //  - option2
        //  - subcat (has the attribute: subcat = true)
        //      - option1
        //      - option2
        for (var i=0; i<scope.categories.length; i++) {
            var c = scope.categories[i];
            var t = c.title;
            var spt = t.split(' > ');
            if (spt.length > 1) {
                var parent_cat = spt[0];
                c.subcat = true;
                for (var j=0; j<scope.categories.length; j++) {
                    var c1 = scope.categories[j];
                    if (c1.title === parent_cat) {
                        c1.options.push(c);
                        break;
                    }
                }
                scope.categories.pop(i);
            }
        }
    };

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avBooth/colored-accordion-screen-directive/colored-accordion-screen-directive.html'
    };
  });
