angular.module('panel', ['ui.bootstrap','ui.utils','ui.router','ngAnimate']);

angular.module('panel').config(function($stateProvider) {
    /* Add New States Above */
    
    
    
});

angular.module('panel', ['ngResource'])
        .factory('OpenElectionsService', ['$resource', function($resource) {
                return $resource('https://agora.wadobo.dev:1000/api/v1/agora/1/open_elections/', {}, {'query': {method: 'GET', isArray: false}});
            }])
        .controller('PanelController', ['OpenElectionsService', '$scope', function(OpenElectionsService, $scope) {
                $scope.elections = OpenElectionsService.query();
            }]);