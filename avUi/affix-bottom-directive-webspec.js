/* jshint ignore:start */
describe("affix-bottom-directive tests", function () {

  beforeEach(function () {
    browser.get('/#/election/1/vote/ff66424d7d77607bbfe78209e407df6fff31abe214a1fe3b3a7dd82600ec0000/8dee0c135afeae29e208550e7258dab7b64fb008bc606fc326d41946ab8e773f:1:1411130040');
  });

  it("affix-bottom is present", function () {
    browser.manage().window().setSize(320, 480);
    expect(element(by.css('.affix-bottom')).isPresent()).toBe(true);

  });

});

/* jshint ignore:end */