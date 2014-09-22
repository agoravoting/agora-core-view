/*
 * ConfigService is a function that returns the configuration that exists
 * in this same file, which you might want to edit and tune if needed.
 */

var avConfigData = {
  // the base url path for ajax requests, for example for sending ballots or
  // getting info about an election. This url is usually in the form of
  // 'https://foo/api/v3/' and always ends in '/'.
  baseUrl: "/temp_data/",

  // default language of the application
  language: "es",

  // if we are in debug mode or not
  debug: true,

  // contact data where users can reach to a human when they need it
  contact: {
    email: "contact@example.com",
    twitter: "agoravoting"
  },
};

angular.module('avConfig', [])
  .factory('ConfigService', function() {
      return avConfigData;
  });
