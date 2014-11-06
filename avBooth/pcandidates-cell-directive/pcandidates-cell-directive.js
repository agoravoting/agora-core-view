/*
 * Directive that shows a draft option cell.
 */
angular.module('avBooth')
  .directive('avbPcandidatesCell', function($filter) {

    var link = function(scope, element, attrs) {
      scope.question_slug = attrs.avbPcandidatesCell;
      scope.candidates = scope.$parent.team[scope.question_slug];
      scope.candidates.selected = $filter("avbCountSelectedOptions")(scope.candidates);
    };

    return {
      restrict: 'AE',
      link: link,
      scope: true,
      templateUrl: 'avBooth/pcandidates-cell-directive/pcandidates-cell-directive.html'
    };
  });