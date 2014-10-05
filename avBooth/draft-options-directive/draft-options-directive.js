/*
 * Draft Options directive.
 *
 * Lists the available options in an election, grouping options via their
 * question and their name. Used by avbDraftsElectionScreen directive.
 */
angular.module('avBooth')
  .directive('avbDraftOptions', function() {

    var link = function(scope, element, attrs) {
      console.log("avbDraftOptions loaded");
    };

    return {
      restrict: 'E',
      scope: true,
      link: link,
      templateUrl: 'avBooth/draft-options-directive/draft-options-directive.html'
    };
  });