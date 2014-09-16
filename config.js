/*
 * ConfigService is a function that returns the configuration that exists
 * in this same file, which you might want to edit and tune if needed.
 */
angular.module('avConfig', ['ngResource'])
  .factory('ConfigService', function($resource) {
      return avConfigData;
  });

var avConfigData = {
  // the base url path for ajax requests, for example for sending ballots or
  // getting info about an election. This url is usually in the form of
  // 'https://foo/api/v3/' and always ends in '/'.
  baseUrl: "/",
  
  // Contact email where users can reach to a human when they need it
  contactEmail: "contact@example.com"
}
