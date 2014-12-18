angular.module('avAdmin')

    .factory('AuthApi', ['$http', function($http) {
        var backendUrl = "";
        var authapi = {};

        // TEST
        //authapi.test = function() {
        //    return $http.get(backendUrl);
        //};

        return authapi;

    }])

    .factory('ElectionsApi', ['$http', function($http) {
        // FAKE, TODO make it real
        var backendUrl = "/temp_data";
        var electionsapi = {};

        electionsapi.elections = function(adminid, adminauth) {
            return $http.get(backendUrl + '/elections');
        };

        return electionsapi;
    }]);
