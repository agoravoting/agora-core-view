angular.module('avRegistration')

    .factory('Patterns', function() {
        var patterns = {};
        patterns.get = function(name) {
            if (name === 'dni') {
                return /^\d{7,8}[a-zA-Z]{1}$/i;
            } else if (name === 'mail' || name === 'email') {
                return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            } else {
                return /.*/;
            }
        };
        return patterns;
    })

    .factory('Authmethod', ['$http', 'ConfigService', function($http, ConfigService) {
        var backendUrl = ConfigService.authAPI;
        var authmethod = {};

        authmethod.signup = function(method, id, data) {
            return $http.post(backendUrl + 'authmethod/'+ method + '/register/' + id + '/', data);
        };

        authmethod.validate = function(method, id, data) {
            return $http.post(backendUrl + 'authmethod/'+ method + '/validate/' + id + '/', data);
        };

        authmethod.login = function(data) {
            return $http.post(backendUrl + 'login/', data);
        };

        authmethod.viewEvent = function(id) {
            return $http.get(backendUrl + 'auth-event/' + id + '/');
        };

        authmethod.viewEvents = function() {
            return $http.get(backendUrl + 'auth-event/');
        };

        authmethod.createEvent = function(data) {
            return $http.post(backendUrl + 'auth-event/', data);
        };

        authmethod.editEvent = function(id, data) {
            return $http.post(backendUrl + 'auth-event/' + id +'/', data);
        };

        // TEST
        authmethod.test = function() {
            return $http.get(backendUrl);
        };

        authmethod.setAuth = function(auth) {
            $http.defaults.headers.common.Authorization = auth;
            return false;
        };

        return authmethod;

    }]);
