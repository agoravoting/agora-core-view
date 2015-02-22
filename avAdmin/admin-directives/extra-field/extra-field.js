angular.module('avAdmin')
  .directive('avExtraField', function() {
    function link(scope, element, attrs) {
      if (scope.field.edit !== undefined) {
        scope.edit = true;
        delete scope.field.edit;
      } else {
        scope.edit = false;
      }
      scope.field.disabled = true;
      scope.editable = !(
        (scope.election.census.auth_method === "sms" && scope.field.name === "tlf") ||
        (scope.election.census.auth_method === "email" && scope.field.type === "email"));

      scope.toggleEdit = function() {
        scope.edit = !scope.edit;
      };

      scope.removeField = function() {
        var index = scope.election.census.extra_fields.indexOf(scope.field);
        delete scope.election.census.extra_fields[index];
      };
    }

    return {
      restrict: 'AE',
      scope: true,
      link: link,
      templateUrl: 'avAdmin/admin-directives/extra-field/extra-field.html'
    };
  });
