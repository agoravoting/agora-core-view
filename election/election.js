/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('election', ['ui.bootstrap','ui.utils','ui.router','ngAnimate']);

angular.module('election').config(function($stateProvider) {
    /* Add New States Above */
    
    
    
});

angular.module('election', ['ngResource'])
        .factory('ElectionService', ['$resource', function($resource) {
            return $resource('https://agora.wadobo.dev:1000/api/v1/election/:electionId/ ', {}, {'query': {method: 'GET'}});
            }])
        .controller('ElectionController', ['ElectionService', '$scope', '$stateParams', function(ElectionService, $scope, $stateParams) {
                $scope.id = $stateParams.id;
                $scope.election = ElectionService.query( {electionId : $scope.id} );
                
            }]);
