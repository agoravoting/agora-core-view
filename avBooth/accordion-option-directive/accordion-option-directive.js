/*
 * Directive that shows an accordion option.
 */
angular.module('avBooth')
  .directive('avbAccordionOption', function($sce) {

    var link = function(scope, element, attrs) {
      scope.urls = _.object(_.map(scope.option.urls, function(url) {
        return [url.title, url.url];
      }));

      /**
       * Returns the answer's urls as an associative array
       */
      scope.getUrls = function (answer) {
        return _.object(_.map(answer.urls, function(url) {
          return [url.title, url.url];
        }));
      };

      // check is youtube
      scope.isYoutube = function (answer) {
        var url = scope.getUrls(answer)['Image URL'];
        if (!url) {
          return false;
        }

        if (url.indexOf("https://youtube.com/embed/") === 0) {
          return $sce.trustAsResourceUrl(url);
        }

        if (url.indexOf("https://www.youtube.com/watch?v=") === 0) {
          return $sce.trustAsResourceUrl(url
          .replace("/watch?v=", "/embed/")
          .replace("&feature=youtu.be", ""));
        }

        if (url.indexOf("https://youtu.be/") === 0) {
          return $sce.trustAsResourceUrl(url
          .replace("https://youtu.be/", "https://youtube.com/embed/")
          .replace("&feature=youtu.be", ""));
        }

        return false;
      };

      scope.showCategory = false;
      if (!!attrs.showCategory) {
        scope.showCategory = true;
      }

      scope.showSelectedPos = false;
      if (!!attrs.showSelectedPos) {
        scope.showSelectedPos = true;
      }

      scope.isPreset = (scope.showSelectedPos && scope.presetSelectedSize > 0 && scope.option.selected - scope.presetSelectedSize < 0);
    };

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avBooth/accordion-option-directive/accordion-option-directive.html'
    };
  });