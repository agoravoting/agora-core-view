/* jshint ignore:start */
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  frameworks: ['jasmine'],
  specs: [
    'avUi/affix-bottom-directive-spec.js',
    'avUi/affix-top-directive-spec.js'
  ],
  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  },
  baseUrl: 'http://localhost:9001'
}
