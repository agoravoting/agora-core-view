/* jshint ignore:start */
describe("collapsing-directive tests", function () {

  beforeEach(function () {
    browser.get('/#/election/:id/vote/:hash/:message');
  });

  it("data-toggle-selector and unfixed-top-height are present", function () {
    var el = element(by.xpath('//div[@data-toggle-selector]'));
    expect(el.getAttribute('data-toggle-selector')).toBe('avb-start-screen #avb-toggle');
    expect(element(by.xpath('//div[@av-collapsing=".unfixed-top-height"]')).isPresent()).toBe(true);    
  });
  
  it("avb-help-screen is displayed on click", function () {
    var el = element(by.css('.glyphicon'), ('.glyphicon-question-sign'));
    expect(element(by.xpath('//avb-help-screen')).isPresent()).toBe(false);
    el.click();
    expect(element(by.xpath('//avb-help-screen')).isPresent()).toBe(true);    
  });

});