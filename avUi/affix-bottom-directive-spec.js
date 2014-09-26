/* jshint ignore:start */
describe("affix-bottom-directive tests", function () {

  beforeEach(function () {
    browser.get('/#/election/:id/vote/:hash/:message');
  });

  it("affix-bottom is present", function () {
    browser.manage().window().setSize(320, 480);
    expect(element(by.css('.affix-bottom')).isPresent()).toBe(true);

  });

});
