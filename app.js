angular.module('agoraCoreView', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate', 'home', 'panel']);

angular.module('agoraCoreView').config(function($stateProvider, $urlRouterProvider) {

    /* Add New States Above */
    $urlRouterProvider
            .otherwise('/home');

    $stateProvider
            .state('panel', {
                url: '/panel',
                templateUrl: 'panel/panel.html',
//                controller: "PanelController"
            })
            .state('home', {
                url: '/home',
                templateUrl: 'home/home.html',
                controller: "HomeController"
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