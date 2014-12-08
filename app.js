angular.module(
  'agora-core-view',
  ['ui.bootstrap',
  'ui.utils',
  'ui.router',
  'jm.i18next',
  'ngAnimate',
  'ngResource',
  'ngSanitize',
  'angularMoment',
  'avConfig',
  'avUi',
  'avBooth',
  'avRegistration',
  'avTest',
  'avCrypto',
  'avElection'
]);

angular.module('jm.i18next').config(function ($i18nextProvider) {
  // note that we do not send the language: by default, it will try the language
  // supported by the web browser
  $("#no-js").hide();

  $i18nextProvider.options = {
    useCookie: false,
    useLocalStorage: false,
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
      .state('booth-nohmac', {
        url: '/election/:id/vote',
        templateUrl: 'avBooth/booth.html',
        controller: "BoothController"
      });
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'avRegistration/login-controller/login-controller.html',
        controller: "LoginController"
      });
    $stateProvider
      .state('results', {
        url: '/election/:id/results',
        templateUrl: 'avElection/results-controller/results-controller.html',
        controller: "ResultsController"
      })
      .state('results.loading', {
        templateUrl: 'avElection/results-controller/loading.html',
      })
      .state('results.show', {
        templateUrl: 'avElection/results-controller/show.html',
      })
      .state('results.error', {
        templateUrl: 'avElection/results-controller/error.html',
      });
    $stateProvider
      .state('test-hmac', {
        url: '/test_hmac/:key/:hmac/:message',
        templateUrl: 'test/test_hmac.html',
        controller: "TestHmacController"
      });
    $stateProvider
      .state('unit-test-e2e', {
        url: '/unit-test-e2e',
        templateUrl: 'test/unit_test_e2e.html',
        controller: "UnitTestE2EController"
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