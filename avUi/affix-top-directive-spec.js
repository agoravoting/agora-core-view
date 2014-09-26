/* jshint ignore:start */
describe("affix-top-directive tests", function () {

  var url = 'http://localhost:9001/#/election/:id/vote/:hash/:message';

  beforeEach(function () {
    browser.get(url);
  });

  it("navbar-unfixed-top is present", function () {
    // FIX-ME
    expect(element(by.css('.navbar-unfixed-top')).isPresent()).toBe(true);
  });

});
