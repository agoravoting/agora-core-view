angular.module('avRegistration')
  .directive('avrImageField', function($state, $timeout) {
    function link(scope, element, attrs) {
        function readImage(input) {
            if ( input.files && input.files[0] ) {
                var FR = new FileReader();
                FR.onload = function(e) {
                     scope.field.value = e.target.result;
                };
                FR.readAsDataURL( input.files[0] );
            }
        }

        $timeout(function() {
            $("#image-field").change(function() { readImage( this ); });
        }, 0);
    }

    return {
      restrict: 'AE',
      link: link,
      scope: true,
      templateUrl: 'avRegistration/fields/image-field-directive/image-field-directive.html'
    };
  });
