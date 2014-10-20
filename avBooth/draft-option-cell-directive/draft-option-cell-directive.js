/*
 * Directive that shows a draft option cell.
 */
angular.module('avBooth')
  .directive('avbDraftOptionCell', function() {

    var link = function(scope, element, attrs) {
      var opts = _.filter(scope.option.documents, function (opt) {
        return opt.category === attrs.avbDraftOptionCell;
      });
      if (opts.length > 0) {
        scope.opt = opts[0];
      }
      else {
        scope.opt = null;
      }

      scope.selectCell = function () {
        console.log("TODO");
      };
    };

    return {
      restrict: 'AE',
      link: link,
      scope: true,
      templateUrl: 'avBooth/draft-option-cell-directive/draft-option-cell-directive.html'
    };
  });