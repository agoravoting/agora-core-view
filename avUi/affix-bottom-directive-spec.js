/* jshint ignore:start */
describe("affix-bottom-directive tests", function () {

  var url = 'http://localhost:9001/#/election/:id/vote/:hash/:message';

  beforeEach(function () {
    browser.get(url);
  });

  it("affix-bottom is present", function () {
    browser.manage().window().setSize(320, 480);
    expect(element(by.css('.affix-bottom')).isPresent()).toBe(true);

  });

});
