angular.module('avAdmin')
  .directive('avCensusField', function(Authmethod) {
    function link(scope, element, attrs) {
      if (scope.field.type === 'dict') {
        try {
          scope.dictVal = angular.fromJson(scope.c.metadata[scope.field.name]);
        } catch(e) {
          scope.dictVal = {};
        }
      } else if (scope.field.type === 'image') {
        scope.viewImage = function() {
          window.mdata = scope.c.metadata;
          Authmethod.getImage(scope.election.id, scope.c.metadata[scope.field.name])
            .success(function(data) {
                $('#imageModalFields').empty();
                scope.election.census.extra_fields.forEach(function(f) {
                    if (f.type !== 'image') {
                        var fi = scope.c.metadata[f.name];
                        $('#imageModalFields').append(f.name + ': ' + fi + '<br/>');
                    }
                });
                $('#imageModal').find('img').attr('src', data.img);
                $('#imageModal').modal('toggle');
            });
          return false;
        };
      }
    }

    return {
      restrict: 'AE',
      link: link,
      scope: true,
      templateUrl: 'avAdmin/admin-directives/census-field/census-field.html'
    };
  });
