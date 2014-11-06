/*
 * Podemos Candidates Rows directive.
 *
 * Lists the available rows (teams) in an election, filtered.
 */
angular.module('avBooth')
  .directive('avbPcandidatesRows', function($filter) {

    var link = function(scope, element, attrs) {

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

        function hasMatch(text, filter) {
          return removeAccents(text.toLowerCase()).indexOf(filter) > -1;
        }

        // filter function that filters option.value ignoring accents
        function filterRow(team) {
            if (!scope.stateData.filter) {
              return true;
            }

            var filter = removeAccents(scope.stateData.filter.toLowerCase());
            if (hasMatch(team.title, filter)) {
              return true;
            }

            if (_.find(team.secretario, function (candidate) {
                return hasMatch(candidate.value, filter);
              }) !== undefined) {
              return true;
            }

            if (_.find(team.consejo, function (candidate) {
                return hasMatch(candidate.value, filter);
              }) !== undefined) {
              return true;
            }

            if (_.find(team.garantias, function (candidate) {
                return hasMatch(candidate.value, filter);
              }) !== undefined) {
              return true;
            }
            return false;
        }


        function updateFilteredOptions() {
          scope.filteredOptions = $filter('filter')(scope.groupedOptions, filterRow);
        }

        scope.$watch("stateData.filter", updateFilteredOptions);
        updateFilteredOptions();
    };

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avBooth/pcandidates-rows-directive/pcandidates-rows-directive.html'
    };
  });