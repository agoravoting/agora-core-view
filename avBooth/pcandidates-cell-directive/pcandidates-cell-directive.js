/*
 * Directive that shows a draft option cell.
 */
angular.module('avBooth')
  .directive('avbPcandidatesCell', function($filter) {

    var link = function(scope, element, attrs) {
      scope.question_slug = attrs.avbPcandidatesCell;
      scope.candidates = scope.$parent.team[scope.question_slug];
      scope.candidates.selected = $filter("avbCountSelectedOptions")(scope.candidates);

      if (scope.question_slug === "secretario") {
        scope.question = "Secretaría General";
      }
      else if (scope.question_slug === "consejo") {
        scope.question = "Consejo Ciudadano";
      }
      else if (scope.question_slug === "garantias") {
        scope.question = "Comité de Garantías";
      }

      scope.isOpenCell = function () {
        if (scope.question_slug === "garantias") {
          return scope.$parent.team.isOpenGarantias;
        } else {
          return scope.$parent.team.isOpenConsejo;
        }
      };

      scope.toggleOpenCell = function () {
        if (scope.question_slug === "garantias") {
          scope.$parent.team.isOpenGarantias = !scope.$parent.team.isOpenGarantias;
        } else {
          scope.$parent.team.isOpenConsejo = !scope.$parent.team.isOpenConsejo;
        }
      };
    };

    return {
      restrict: 'AE',
      link: link,
      scope: true,
      templateUrl: 'avBooth/pcandidates-cell-directive/pcandidates-cell-directive.html'
    };
  });