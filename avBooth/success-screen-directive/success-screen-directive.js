/*
 * Error indicator directive.
 */
angular.module('avBooth')
  .directive('avbSuccessScreen', function(ConfigService, $interpolate) {

    function link(scope, element, attrs) {
      var text = $interpolate(ConfigService.success.text);

      scope.successText = text({electionId: scope.election.id});
    }

    return {
      restrict: 'AE',
      link: link,
      templateUrl: 'avBooth/success-screen-directive/success-screen-directive.html'
    };
  });
