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

        authmethod.ping = function() {
            return $http.get(backendUrl + 'auth-event/0/ping/');
        };

        authmethod.login = function(data) {
            return $http.post(backendUrl + 'auth-event/0/authenticate/', data);
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

        authmethod.getRegisterFields = function (viewEventData) {
          var fields = angular.copy(viewEventData.extra_fields);
          if (!fields) { fields = []; }
          if (viewEventData.auth_method === "sms") {
            fields.unshift({
              "name": "code",
              "type": "text",
              "required": true,
              "min": 3,
              "max": 30,
              "regexp": "[a-z_A-Z0-9]+",
              "required_on_authentication": true
            });
            fields.unshift({
              "name": "tlf",
              "type": "tlf",
              "required": true,
              "required_on_authentication": true
            });
          } else if (viewEventData.auth_method === "email") {
            fields.unshift({
              "name": "code",
              "type": "code",
              "required": true,
              "required_on_authentication": true
            });
            fields.unshift({
              "name": "email",
              "type": "email",
              "required": true,
              "required_on_authentication": true
            });
          } else if (viewEventData.auth_method === "user-and-password") {
            fields.unshift({
              "name": "password",
              "type": "password",
              "required": true,
              "required_on_authentication": true
            });
            fields.unshift({
              "name": "email",
              "type": "email",
              "required": true,
              "required_on_authentication": true
            });
          }
          return fields;
        };

        authmethod.getLoginFields = function (viewEventData) {
          return _.filter(
            authmethod.getRegisterFields(viewEventData),
            function (field) {return field.required_on_authentication;});
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
