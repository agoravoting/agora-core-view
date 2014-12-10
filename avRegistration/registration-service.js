angular.module('avRegistration')

    .factory('Authmethod', ['$http', function($http) {
        var backendUrl = "http://localhost:8000";
        var authmethod = {};

        authmethod.signup = function(method, id, data) {
            return $http.post(backendUrl + '/api/authmethod/'+ method + '/register/' + id, data);
        };

        authmethod.validate = function(method, user, code, data) {
            return $http.post(backendUrl + '/api/authmethod/'+ method + '/register/' + user + '/' + code + '/', data);
        };

        authmethod.viewEvent = function(id) {
            return $http.get(backendUrl + '/api/auth-event/' + id);
        };

        authmethod.viewEvents = function() {
            return $http.get(backendUrl + '/api/auth-event/');
        };

        // TEST
        authmethod.test = function() {
            return $http.get(backendUrl);
        };

        return authmethod;

    }]);
