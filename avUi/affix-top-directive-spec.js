/* jshint ignore:start */
describe("affix-top-directive tests", function () {

  beforeEach(function () {
    browser.get('/#/election/:id/vote/:hash/:message');
  });

  it("navbar-unfixed-top is present", function () {
    expect(element(by.xpath('//nav[@av-affix-top=".navbar-unfixed-top"]')).isPresent()).toBe(true);
  });

});
