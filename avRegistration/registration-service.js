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

        authmethod.signup = function(data) {
            var eid = data.authevent || '0';
            return $http.post(backendUrl + 'auth-event/'+eid+'/register/', data);
        };

        authmethod.ping = function() {
            return $http.get(backendUrl + 'auth-event/0/ping/');
        };

        authmethod.login = function(data) {
            var eid = data.authevent || '0';
            return $http.post(backendUrl + 'auth-event/'+eid+'/authenticate/', data);
        };

        authmethod.getPerm = function(perm, object_type, object_id) {
            var data = {
                permission: perm,
                object_type: object_type,
                object_id: object_id + "" // to convert to string
            };
            return $http.post(backendUrl + 'get-perms/', data);
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

        authmethod.addCensus = function(id, data) {
            return $http.post(backendUrl + 'auth-event/' + id + '/census/', data);
        };

        authmethod.getRegisterFields = function (viewEventData) {
          var fields = angular.copy(viewEventData.extra_fields);
          if (!fields) { fields = []; }
          if (viewEventData.auth_method === "sms") {
            fields.push({
              "name": "tlf",
              "type": "tlf",
              "required": true,
              "required_on_authentication": true
            });
          } else if (viewEventData.auth_method === "email") {
            fields.push({
              "name": "email",
              "type": "email",
              "required": true,
              "required_on_authentication": true
            });
          } else if (viewEventData.auth_method === "user-and-password") {
            fields.push({
              "name": "email",
              "type": "email",
              "required": true,
              "required_on_authentication": true
            });
            fields.push({
              "name": "password",
              "type": "password",
              "required": true,
              "required_on_authentication": true
            });
          }

          // put captha the last
          for (var i=0; i<fields.length; i++) {
              if (fields[i]['type'] === "captcha") {
                  var captcha = fields.splice(i, 1);
                  fields.push(captcha[0]);
                  break;
              }
          }
          return fields;
        };

        authmethod.getLoginFields = function (viewEventData) {
            var fields = authmethod.getRegisterFields(viewEventData);
            if (viewEventData.auth_method === "sms" || viewEventData.auth_method === "email") {
              fields.push({
                "name": "code",
                "type": "code",
                "required": true,
                "required_on_authentication": true
              });
            }

            fields = _.filter(fields, function (field) {return field.required_on_authentication;});

            // put captha the last
            for (var i=0; i<fields.length; i++) {
                if (fields[i]['type'] === "captcha") {
                    var captcha = fields.splice(i, 1);
                    fields.push(captcha[0]);
                    break;
                }
            }
            return fields;
        };

        authmethod.newCaptcha = function() {
            return $http.get(backendUrl + 'captcha/new/', {});
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
