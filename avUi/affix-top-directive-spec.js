/* jshint ignore:start */
describe("affix-top-directive tests", function () {

  beforeEach(function () {
    browser.get('/#/election/:id/vote/:hash/:message');
  });

  it("navbar-unfixed-top is present", function () {
    // FIX-ME
    expect(element(by.css('.navbar-unfixed-top')).isPresent()).toBe(true);
  });

});
