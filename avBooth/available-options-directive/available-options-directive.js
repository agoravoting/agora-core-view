/*
 * Available Options directive.
 *
 * Lists the available options for a question.
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

        scope.toggleSelectItem = function(option) {
          if (option.selected > -1) {
            option.selected = -1;
          } else {
            option.selected = _.filter(scope.options, function (element) {
              return element.selected > -1;
            }).length;
          }
        };
    };

    return {
      restrict: 'E',
      scope: {
        max: '=',
        min: '=',
        options: '=',
        layout: '=',
        filter: '@'
      },
      link: link,
      templateUrl: 'avBooth/available-options-directive/available-options-directive.html'
    };
  });