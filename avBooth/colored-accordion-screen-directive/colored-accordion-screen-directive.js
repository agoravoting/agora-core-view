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

        var categories = _.groupBy(scope.options, "category");
    };

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avBooth/colored-accordion-screen-directive/colored-accordion-screen-directive.html'
    };
  });
