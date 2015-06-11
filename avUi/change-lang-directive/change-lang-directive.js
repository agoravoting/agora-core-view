/*
 * Simple change lang directive, that can be used in the navbar as a list
 * element:
 * <li class="dropdown" av-change-lang></li>
 */
angular.module('avUi')
  .directive('avChangeLang', function($i18next, angularLoad, amMoment) {
    function link(scope, element, attrs) {
      scope.deflang = $i18next.options.lng || navigator.language;
      scope.changeLang = function(newl) {
        $i18next.options.lng = newl;
        scope.deflang = $i18next.options.lng;

        // async load moment i18n
        angularLoad
          .loadScript('/locales/moment/' + newl + '.js')
          .then(function () {
            amMoment.changeLocale(newl);
          });
      };
    }

    return {
      restrict: 'AE',
      scope: {},
      link: link,
      templateUrl: 'avUi/change-lang-directive/change-lang-directive.html'
    };
  });