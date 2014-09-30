/* jshint ignore:start */
describe("affix-bottom-directive tests", function () {

  beforeEach(function () {
    var html = '<div style="background-color:yellow; height: 500px;">' +
            '<div av-affix-bottom data-force-affix-width="768"></div>' + '</div>';
    browser.get('/#/unit-test-e2e?html=' + encodeURIComponent(html));
  });

  it("affix-bottom is present", function () {
    browser.manage().window().setSize(320, 480);
    expect(element(by.css('.affix-bottom')).isPresent()).toBe(true);
  });

});

/* jshint ignore:end */