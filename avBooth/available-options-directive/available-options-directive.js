/*
 * Available Options directive.
 *
 * Lists the available options for a question, allowing to change selection.
 */
angular.module('avBooth')
  .directive('avbAvailableOptions', function() {

    var link = function(scope, element, attrs) {
        // initialize selection, only if needed
        _.each(scope.options, function (element) {
          if (element.selected === undefined) {
            element.selected = -1;
          }
        });

        /*
         * Toggles selection, if possible.
         */
        scope.toggleSelectItem = function(option) {
          if (option.selected > -1) {
            option.selected = -1;
          } else {
            var numSelected = _.filter(scope.options, function (element) {
              return element.selected > -1;
            }).length;

            // can't select more, flash info
            if (numSelected === scope.max) {
              $("#maxSelectedLimitReached").flash("white", "#0081B9", 200);
              return;
            }

            option.selected = numSelected;
          }
        };
    };

    return {
      restrict: 'E',
      scope: {
        // max number of selected options allowed
        max: '=',

        // min number of selected options allowed
        min: '=',

        // list of options
        options: '=',

        // layout, changes the way the options are rendered
        layout: '=',

        // only if max is 1 and autoSelectAnother is true, then selecting
        // an option automatically removes any previous selection if any.
        autoSelectAnother: '=',

        // text used to filter the shown options
        filter: '@'
      },
      link: link,
      templateUrl: 'avBooth/available-options-directive/available-options-directive.html'
    };
  });