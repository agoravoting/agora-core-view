angular.module('avAdmin')
  .directive('avExtraField', function() {
    function link(scope, element, attrs) {
      if (scope.field.edit !== undefined) {
        scope.extra_fields.editing = scope.field;
        delete scope.field.edit;
      }
      scope.field.disabled = true;
      scope.editable = !(
        (scope.election.census.auth_method === "sms" && scope.field.name === "tlf") ||
        (scope.election.census.auth_method === "email" && scope.field.type === "email"));

      scope.toggleEdit = function() {
        if (scope.extra_fields.editing === scope.field) {
          scope.extra_fields.editing = null;
        } else {
          scope.extra_fields.editing = scope.field;
        }
      };

      scope.beingEdited = function() {
        return scope.extra_fields.editing === scope.field;
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
