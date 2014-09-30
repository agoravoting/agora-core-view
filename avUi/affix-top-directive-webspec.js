/* jshint ignore:start */
describe("affix-top-directive tests", function () {

  beforeEach(function () {
    browser.get('/#/election/1/vote/ff66424d7d77607bbfe78209e407df6fff31abe214a1fe3b3a7dd82600ec0000/8dee0c135afeae29e208550e7258dab7b64fb008bc606fc326d41946ab8e773f:1:1411130040');
  });

  it("navbar-unfixed-top is present", function () {
    expect(element(by.xpath('//nav[@av-affix-top=".navbar-unfixed-top"]')).isPresent()).toBe(true);
  });

});

/* jshint ignore:end */
