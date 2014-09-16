angular.module('agoraCoreView',
               ['ui.bootstrap',
                'ui.utils',
                'ui.router',
                'ngAnimate',
                'home',
                'avConfig',
                'avBooth',
              ]);

angular.module('agoraCoreView').config(
  function($stateProvider, $urlRouterProvider, $httpProvider) {
    
    /* Add New States Above */
    $stateProvider
      .state('home', {
        url: '/election/:id/vote/:hash/:message',
        templateUrl: 'avBooth/booth.html',
        controller: "BoothController"
      });
});

angular.module('agoraCoreView').run(function($rootScope) {

  $rootScope.safeApply = function(fn) {
    var phase = $rootScope.$$phase;
    if (phase === '$apply' || phase === '$digest') {
      if (fn && (typeof(fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };

});