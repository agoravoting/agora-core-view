/*
 * Directive that shows an accordion ahoram-primaries option.
 */
angular.module('avBooth')
  .directive('avbAhoramPrimariesOption', function() {
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
      templateUrl: 'avBooth/ahoram-primaries-option-directive/ahoram-primaries-option-directive.html'
    };
  });