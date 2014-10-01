/* jshint ignore:start */
/*
 * Tests the presence of affix-bottom on different resolutions and
 * data-force-affix-width values;
 * 
 * Resolutions: 320x480, 600x800, 768x1024, 720x1280 and 1080x1920.
 * data-foce-affix-width: 568, 768 and 868.
 * 
 * affix-bottom should be present if 
 * data-force-affix-width > browser.manage().window().width
 */
describe("affix-bottom-directive tests", function () {

  var html;
  var dataForceAffixWidth;

  function setDataForceAffixWidth(width) {
    dataForceAffixWidth = width;
    return '<div style="background-color:yellow; height: 500px;">' +
            '<div av-affix-bottom data-force-affix-width="' + dataForceAffixWidth + '">' +
            '</div></div>';
  }

  function testResolutions() {
    for (var i = 0; i < 5; i++) {
      var browserWidth;
      var browserHeight;
      switch (i) {
        case 0:
          browserWidth = 320;
          browserHeight = 480;
          break;
        case 1:
          browserWidth = 600;
          browserHeight = 800;
          break;
        case 2:
          browserWidth = 768;
          browserHeight = 1024;
          break;
        case 3:
          browserWidth = 720;
          browserHeight = 1280;
          break;
        case 4:
          browserWidth = 1080;
          browserHeight = 1920;
          break;
        default:
          return;
      }

      browser.manage().window().setSize(browserWidth, browserHeight);
      browser.get('/#/unit-test-e2e?html=' + encodeURIComponent(html));

      if (dataForceAffixWidth > browserWidth) {
        expect(element(by.css('.affix-bottom')).isPresent()).toBe(true);
      } else {
        expect(element(by.css('.affix-bottom')).isPresent()).toBe(false);
      }
    }
  }

  it("affix-bottom is present (568)", function () {
    html = setDataForceAffixWidth(568);
    testResolutions();
  });

  it("affix-bottom is present (768)", function () {
    html = setDataForceAffixWidth(768);
    testResolutions();
  });

  it("affix-bottom is present (868)", function () {
    html = setDataForceAffixWidth(868);
    testResolutions();
  });

});

/* jshint ignore:end */