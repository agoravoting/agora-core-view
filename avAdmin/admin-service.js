angular.module('avAdmin')

    .factory('AuthApi', ['ConfigService', '$http', function(ConfigService, $http) {
        var backendUrl = ConfigService.authAPI;
        var authapi = {};

        authapi.electionsIds = function() {
            return $http.get(backendUrl + 'api/acl/mine/?object_type=AuthEvent&perm=admin');
        };

        return authapi;

    }])

    .factory('ElectionsApi', ['$http', function($http) {
        // FAKE, TODO make it real
        //var backendUrl = ConfigService.electionsAPI;
        var backendUrl = "/temp_data";
        var electionsapi = {};

        electionsapi.elections = function() {
            return $http.get(backendUrl + '/elections');
        };

        electionsapi.election = function(id) {
            return $http.get(backendUrl + '/election/'+id+'/config');
        };

        return electionsapi;
    }]);
