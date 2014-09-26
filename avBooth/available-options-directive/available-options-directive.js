/*
 * Available Options directive.
 *
 * Lists the available options.
 */
angular.module('avBooth')
  .directive('avbAvailableOptions', function() {

    var link = function(scope, element, attrs) {
        console.log("scope.options");
    };

    return {
      restrict: 'E',
      scope: {
        max: '=',
        min: '=',
        options: '=',
        selection: '=',
        filter: '@'
      },
      link: link,
      templateUrl: 'avBooth/available-options-directive/available-options-directive.html'
    };
  });