angular.module('avRegistration')

    .factory('Authmethod', ['$http', function($http) {
        var backendUrl = "http://localhost:8000";
        var authmethod = {};

        authmethod.signup = function(method, id, data) {
            return $http.post(backendUrl + '/api/authmethod/'+ method + '/register/' + id + '/', data);
        };

        authmethod.validate = function(method, id, data) {
            return $http.post(backendUrl + '/api/authmethod/'+ method + '/validate/' + id + '/', data);
        };

        authmethod.login = function(data) {
            return $http.post(backendUrl + '/api/login/', data);
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
