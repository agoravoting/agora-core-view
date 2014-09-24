/*
 * Multiquestion directive.
 *
 * Shows a question and its possible answers to the user.
 */
angular.module('avBooth')
  .directive('avMultiQuestion', function() {
    
//     $scope.question = $scope.election.question;
//     $scope.answers = $scope.election.answers;
    
    /* For third party libs, it's recommended to use a directive 
     * and jQuery/jqLite within the directive */
    
    function link(scope, element, attrs) {
      // sets the collapsed navbar max-height
      scope.setNavBarHeight = function(percentage) {
        
         var windowHeight = $(window).innerHeight();
         $('nav .collapse').css('max-height', windowHeight*percentage);
        
      };
      
      scope.toggleArrow = function() {
        
        /* only show one navbar-collapse each time and change the chevron position */
        $('#selected-options').on('show.bs.collapse', function () {
          $("#search-options.in").collapse('hide');
          $(".navbar-brand .glyphicon").attr(
          "class", "glyphicon glyphicon-chevron-up white");
        });

        $('#selected-options').on('hide.bs.collapse', function () {
          $(".navbar-brand .glyphicon").attr(
          "class", "glyphicon glyphicon-chevron-down white");
        });
        
        $('#search-options').on('show.bs.collapse', function () {
          $("#selected-options.in").collapse('hide');
        });        
      };      
      
      /* always collapsed navbar max height to 70% */
      scope.setNavBarHeight(0.70);
      
      scope.toggleArrow();
      
    }
    
    return {
      restrict: 'E',
      scope: {},
      link: link,
      templateUrl: 'avBooth/multi-question-directive/multi-question-directive.html'
    };
  });