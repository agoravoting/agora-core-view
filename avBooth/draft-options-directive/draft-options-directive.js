/*
 * Draft Options directive.
 *
 * Lists the available options in an election, grouping options via their
 * question and their name. Used by avbDraftsElectionScreen directive.
 */
angular.module('avBooth')
  .directive('avbDraftOptions', function($filter) {

    var link = function(scope, element, attrs) {
        /*
         * Toggles selection, if possible.
         */
        scope.toggleSelectItem = function(option) {
          // we do different things for packs and normal options. Here for packs:
          if (option.isPack) {
            if (option.selected > -1) {
              option.selected = -1;
            } else {
              // TODO: check more things
              option.selected = 0;
            }
            _.each(option.suboptions, function (opt) { opt.selected = option.selected; });

          // and here for normal options
          } else {
            // toggle selection
            if (option.selected > -1) {
              option.selected = -1;
            } else {
              // TODO: check more thins
              option.selected = 0;
            }
          }
        };

        // TODO: only use this when localeCompare is unavailable
        function removeAccents(value) {
          return value
            .replace(/á/g, 'a')
            .replace(/é/g, 'e')
            .replace(/í/g, 'i')
            .replace(/ó/g, 'o')
            .replace(/ú/g, 'u')
            .replace(/ñ/g, 'n');
        }

        // filter function that filters option.value ignoring accents
        function ignoreAccents(item) {
            if (!scope.stateData.filter) {
              return true;
            }

            var text = removeAccents(item.title.toLowerCase());
            var filter = removeAccents(scope.stateData.filter.toLowerCase());
            return text.indexOf(filter) > -1;
        }


        function updateFilteredOptions() {
          console.log("updating filtered options, filter: " + scope.stateData.filter);
          scope.filteredOptions = $filter('filter')(scope.flatOptions, ignoreAccents);
        }

        scope.$watch("stateData.filter", updateFilteredOptions);
        updateFilteredOptions();
    };

    return {
      restrict: 'E',
      link: link,
      templateUrl: 'avBooth/draft-options-directive/draft-options-directive.html'
    };
  });