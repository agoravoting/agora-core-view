angular.module('avAdmin')

    .factory('AuthApi', ['ConfigService', '$http', function(ConfigService, $http) {
        var backendUrl = ConfigService.authAPI;
        var authapi = {};

        authapi.electionsIds = function() {
            return $http.get(backendUrl + 'api/acl/mine/?object_type=AuthEvent&perm=admin');
        };

        return authapi;

    }])

    .factory('ElectionsApi', ['ConfigService', '$http', function(ConfigService, $http) {
        var backendUrl = ConfigService.electionsAPI;
        var electionsapi = {};

        electionsapi.election = function(id) {
            return $http.get(backendUrl + 'api/election/'+id);
        };

        electionsapi.parseElection = function(d) {
            var election = d.payload;
            var conf = JSON.parse(election.configuration);
            conf.status = election.state;
            conf.visibleStatus = election.state;
            if (conf.status === 'registered') {
                conf.status = 'notstarted';
            }
            return conf;
        };

        return electionsapi;
    }]);
