angular.module(
  'agora-core-view',
  ['ui.bootstrap',
  'ui.utils',
  'ui.router',
  'jm.i18next',
  'ngAnimate',
  'ngResource',
  'ngCookies',
  'ngSanitize',
  'angularMoment',
  'avConfig',
  'avUi',
  'avBooth',
  'avRegistration',
  'avTest',
  'avCrypto',
  'avAdmin',
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

    // CSRF verification
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    /* App states and urls are defined here */
    $stateProvider
      .state('election.booth', {
        url: '/:id/vote/:hmac/:message',
        templateUrl: 'avBooth/booth.html',
        controller: "BoothController"
      });
    $stateProvider
      .state('election.booth-nohmac', {
        url: '/:id/vote',
        templateUrl: 'avBooth/booth.html',
        controller: "BoothController"
      });
    $stateProvider
      .state('registration', {
        abstract: true,
        url: '/registration',
        template: '<div ui-view></div>'
      })
      .state('registration.register', {
        url: '/:id/register',
        templateUrl: 'avRegistration/register-controller/register-controller.html',
        controller: "RegisterController"
      })
      .state('registration.validate', {
        url: '/:id/validate',
        templateUrl: 'avRegistration/validate-controller/validate-controller.html',
        controller: "ValidateController"
      })
      .state('registration.login', {
        url: '/:id/login',
        templateUrl: 'avRegistration/login-controller/login-controller.html',
        controller: "LoginController"
      })
      .state('registration.logout', {
        url: '/logout',
        controller: "LogoutController"
      })
      .state('registration.success', {
        templateUrl: 'avRegistration/success.html'
      })
      .state('registration.loading', {
        templateUrl: 'avRegistration/loading.html'
      })
      .state('registration.error', {
        templateUrl: 'avRegistration/error.html'
      });
    // Admin interface
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<div ui-view></div>'
      })
      .state('admin.login', {
        url: '/login',
        templateUrl: 'avAdmin/login-controller/login-controller.html',
        controller: "LoginController"
      })
      // admin directives using the admin controller
      .state('admin.elections',   { url: '/elections',   templateUrl: 'avAdmin/admin-controller/admin-controller.html', controller: 'AdminController' })
      .state('admin.import',      { url: '/import',      templateUrl: 'avAdmin/admin-controller/admin-controller.html', controller: 'AdminController' })
      .state('admin.basic',       { url: '/basic',       templateUrl: 'avAdmin/admin-controller/admin-controller.html', controller: 'AdminController' })
      .state('admin.questions',   { url: '/questions',   templateUrl: 'avAdmin/admin-controller/admin-controller.html', controller: 'AdminController' })
      .state('admin.census',      { url: '/census',      templateUrl: 'avAdmin/admin-controller/admin-controller.html', controller: 'AdminController' })
      .state('admin.auth',        { url: '/auth',        templateUrl: 'avAdmin/admin-controller/admin-controller.html', controller: 'AdminController' })
      .state('admin.tally',       { url: '/tally',       templateUrl: 'avAdmin/admin-controller/admin-controller.html', controller: 'AdminController' })
      .state('admin.dashboard',   { url: '/dashboard',   templateUrl: 'avAdmin/admin-controller/admin-controller.html', controller: 'AdminController' })
      .state('admin.account',     { url: '/account',     templateUrl: 'avAdmin/admin-controller/admin-controller.html', controller: 'AdminController' })
      .state('admin.billinfo',    { url: '/billinfo',    templateUrl: 'avAdmin/admin-controller/admin-controller.html', controller: 'AdminController' })
      .state('admin.billhistory', { url: '/billhistory', templateUrl: 'avAdmin/admin-controller/admin-controller.html', controller: 'AdminController' });

    // END of Admin interface
    $stateProvider
      .state('election', {
        abstract: true,
        url: '/election',
        template: '<div ui-view></div>'
      })
      .state('election.results', {
        url: '/:id/results',
        templateUrl: 'avElection/results-controller/results-controller.html',
        controller: "ResultsController"
      })
      .state('election.results.loading', {
        templateUrl: 'avElection/results-controller/loading.html'
      })
      .state('election.results.error', {
        templateUrl: 'avElection/results-controller/error.html'
      })
      .state('election.results.show', {
        templateUrl: 'avElection/results-controller/show.html'
      })
      .state('election.results.show.unknown', {
        templateUrl: 'avElection/question-results-directive/unknown.html'
      })
      .state('election.results.show.plurality-at-large', {
        template: '<div av-plurality-at-large-results></div>',
      });
    $stateProvider
      .state('election.ballot-locator', {
        url: '/:id/ballot-locator',
        template: '<div av-ballot-locator-screen></div>',
        controller: function($scope, $stateParams) {
          $scope.electionId = $stateParams.id;
        }
      });
    $stateProvider
      .state('unit-test-e2e', {
        url: '/unit-test-e2e',
        templateUrl: 'test/unit_test_e2e.html',
        controller: "UnitTestE2EController"
      });
});

angular.module('agora-core-view').run(function($cookies, $http, $rootScope) {

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
      console.log("change start from " + fromState.name + " to " + toState.name);
      $("#angular-preloading").show();
    });
  $rootScope.$on('$stateChangeSuccess',
    function(event, toState, toParams, fromState, fromParams) {
      console.log("change success");
      $("#angular-preloading").hide();
    });

    if ($cookies.auth) {
        $http.defaults.headers.common.Authorization = $cookies.auth;
    }
});


/*
This directive allows us to pass a function in on an enter key to do what we want.
 */
angular.module('agora-core-view').directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});
