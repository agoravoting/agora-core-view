/*
 * Directive that shows an accordion selected option.
 */
angular.module('avBooth')
  .directive('avbAhoramPrimariesSelectedOption', function() {
    var link = function(scope, element, attrs) {
      scope.getUrl = function(title) {
        return _.filter(scope.option.urls, function (url) {
          return url.title === title;
        })[0];
      };
    };
    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avBooth/ahoram-primaries-selected-option-directive/ahoram-primaries-selected-option-directive.html'
    };
  });