angular.module(
  'agora-core-view',
  ['ui.bootstrap',
  'ui.utils',
  'ui.router',
  'jm.i18next',
  'ngAnimate',
  'ngResource',
  'angularMoment',
  'avConfig',
  'avBooth',
  'avTest',
  'avCrypto',
]);

angular.module('jm.i18next').config(function ($i18nextProvider) {
  // note that we do not send the language: by default, it will try the language
  // supported by the web browser
  $i18nextProvider.options = {
    useCookie: false,
    useLocalStorage: true,
    fallbackLng: 'en',
    resGetPath: '/locales/__lng__.json',
    defaultLoadingValue: '' // ng-i18next option, *NOT* directly supported by i18next
  };
});

angular.module('agora-core-view').config(
  function($stateProvider, $urlRouterProvider, $httpProvider) {

    /* App states and urls are defined here */
    $stateProvider
      .state('booth', {
        url: '/election/:id/vote/:hmac/:message',
        templateUrl: 'avBooth/booth.html',
        controller: "BoothController"
      });
    $stateProvider
      .state('test-hmac', {
        url: '/test_hmac/:key/:hmac/:message',
        templateUrl: 'test/test_hmac.html',
        controller: "TestHmacController"
      });
});

angular.module('agora-core-view').run(function($rootScope) {

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

  $rootScope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams) {
      console.log("change start");
      $("#angular-preloading").show();
    });
  $rootScope.$on('$stateChangeSuccess',
    function(event, toState, toParams, fromState, fromParams) {
      console.log("change success");
      $("#angular-preloading").hide();
    });

});