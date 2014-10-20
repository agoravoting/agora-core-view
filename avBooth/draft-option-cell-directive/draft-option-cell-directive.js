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

      scope.toggleCell = function () {
        // on packs, just call to toggleSelectItem
        if (scope.option.isPack) {
          scope.toggleSelectItem(scope.option);
          return;
        }

        // if selected, we can just deselect it
        if (scope.opt.selected > -1) {
          scope.opt.selected = -1;

          // mark as deselected the whole row if appliable
          var subselection = _.filter(scope.option.documents, function (doc) {
            return doc.selected > -1;
          });
          if (subselection.length === 0) {
            scope.option.isSelected = false;
          }

        // to select the document, we need to do some checks first
        } else {
          var selection = scope.getSelection();
          if (_.intersection(
            _.pluck(selection, "category"),
            [scope.opt.category]
            ).length > 0)
          {
            return scope.showWarning(scope.warningEnum.alreadySelectedDocumentType);
          }
          scope.opt.selected = 0;
          scope.option.isSelected = true;
          scope.updateSelectionWarnings();
        }
      };
    };

    return {
      restrict: 'AE',
      link: link,
      scope: true,
      templateUrl: 'avBooth/draft-option-cell-directive/draft-option-cell-directive.html'
    };
  });