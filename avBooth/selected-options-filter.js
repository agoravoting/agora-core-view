/*
 * Selected Options filter.
 *
 * Given the list of selected options, it filters and sorts the output list
 * by selection.
 */
angular.module('avBooth')
  .filter('avbSelectedOptions', function() {
    return function(optionList) {
      var filtered = _.filter(optionList, function (option) {
          return option.selected > -1;
      });

      return _.sortBy(filtered, function (option) {
        return option.selected;
      });
    };
  });