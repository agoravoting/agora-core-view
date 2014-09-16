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
        .controller('ElectionController', ['ElectionService', '$scope', '$stateParams', '$http', '$log', function(ElectionService, $scope, $stateParams, $http, $log) {
                $scope.id = $stateParams.id;
                ElectionService.query({electionId: $scope.id}).$promise.then(function(election) {
                    $scope.election = election;
                    
                    if ($scope.election.election_type === "ONE_CHOICE") {
                        $scope.inputtype = "radio";
                    } else if ($scope.election.election_type === "MULTIPLE_CHOICE") {
                        $scope.inputtype = "checkbox";
                    }
                });
                
                $scope.formData = {is_vote_secret: false, action: 'vote'};

                $scope.submit = function () {
                    
                    $http({
                        url: 'https://agora.wadobo.dev:1000/api/v1/election/' + $scope.id + '/action/',
                        method: 'POST',
                        withCredentials: true,
                        data: $scope.formData
                    })
                            .success(function(data, status, headers, config) {
//                                $state.go('panel');
                                if (status === '200') {
//                            $scope.messages = 'Welcome ' + $scope.identification;
//                            $scope.identification = null;
//                            $scope.password = null;
//                            $scope.submitted = false;
                                } else {
                                    $scope.messages = 'Oops, we received your request, but there was an error ' + status;
                                    $log.error(data);
                                }
                            })
                            .error(function(data, status, headers, config) {
                                $scope.messages = 'There was a network error. ' + status;
                                $log.error(data);
                            });
                };
                
                
                
            }])
        .directive('electionType', function() {
            return {
                restrict: 'E',
                template: 'Election type: {{election.election_type}}'
            };
        });
