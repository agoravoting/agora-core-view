angular.module('avAdmin')
  .directive('avColumnFilterInt', function() {
    function link(scope, element, attrs) {
      scope.status = {
        isOpen: false
      };
      scope.filter = {
        sort: '',
        min: '',
        max: ''
      };
      scope.filterPrefix = attrs.filterPrefix;
      scope.filterI18n = attrs.filterI18n;
    }

    return {
      restrict: 'AE',
      link: link,
      scope: {
        filterOptionsVar: '&'
      },
      templateUrl: 'avAdmin/admin-directives/column-filters/int/column-filter-int.html'
    };
  });
