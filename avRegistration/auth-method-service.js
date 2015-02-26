angular.module('avRegistration')

    .factory('Authmethod', ['$http', 'ConfigService', function($http, ConfigService) {
        var backendUrl = ConfigService.authAPI;
        var authmethod = {};
        var captcha_code = null;

        authmethod.signup = function(data, authevent) {
            var eid = authevent || '0';
            return $http.post(backendUrl + 'auth-event/'+eid+'/register/', data);
        };

        authmethod.getUserInfo = function(userid) {
            if (typeof userid === 'undefined') {
                return $http.get(backendUrl + 'user/', {});
            } else {
                return $http.get(backendUrl + 'user/%d' % userid, {});
            }
        };

        authmethod.ping = function() {
            return $http.get(backendUrl + 'auth-event/0/ping/');
        };

        authmethod.login = function(data, authevent) {
            var eid = authevent || '0';
            delete data['authevent'];
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

        authmethod.addCensus = function(id, data, validation) {
            if (!angular.isDefined(validation)) {
              validation = "enabled";
            }
            var d = {
                "field-validation": validation,
                "census": data
            };
            return $http.post(backendUrl + 'auth-event/' + id + '/census/', d);
        };

        authmethod.getCensus = function(id) {
            return $http.get(backendUrl + 'auth-event/' + id + '/census/');
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

        authmethod.electionsIds = function(page) {
            if (!page) {
                page = 1;
            }
            return $http.get(backendUrl + 'acl/mine/?object_type=AuthEvent&perm=edit&order=-pk&page='+page);
        };

        authmethod.sendAuthCodes = function(eid, election, user_ids) {
            var url = backendUrl + 'auth-event/'+eid+'/census/send_auth/';
            var data = {};
            if (angular.isDefined(election)) {
              data.msg = election.census.config.msg;
              if (election.census.auth_method === 'email') {
                data.subject = election.census.config.subject;
              }
            }
            if (angular.isDefined(user_ids)) {
              data["user-ids"] = user_ids;
            }
            return $http.post(url, data);
        };

        authmethod.removeUsersIds = function(eid, election, user_ids) {
            var url = backendUrl + 'auth-event/'+eid+'/census/delete/';
            var data = {"user-ids": user_ids};
            return $http.post(url, data);
        };

        authmethod.changeAuthEvent = function(eid, st) {
            var url = backendUrl + 'auth-event/'+eid+'/'+st+'/';
            var data = {};
            return $http.post(url, data);
        };

        return authmethod;

    }]);
