/*
 * Cast or cancel screen directive.
 *
 * This intermediary step shows the hash of the ballot and allows the user to
 * cast or audit it.
 */
angular.module('avBooth')
  .directive('avbCastOrCancelScreen', function($i18next, $filter, $interpolate, $timeout) {

    var link = function(scope, element, attrs) {
      scope.stateData.affixIsSet = false;
      scope.stateData.affixDropDownShown = false;

      scope.audit = function() {
        // TODO
        scope.next();
      };
    };

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avBooth/cast-or-cancel-screen-directive/cast-or-cancel-screen-directive.html'
    };
  });
