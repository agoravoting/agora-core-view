/* jshint ignore:start */
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
          browserWidth = 320
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

  afterEach(function () {
    if (dataForceAffixWidth > browser.manage().window().width) {
      expect(element(by.css('.affix-bottom')).isPresent()).toBe(true);
    } else {
      expect(element(by.css('.affix-bottom')).isPresent()).toBe(false);
    }
  });


});

/* jshint ignore:end */