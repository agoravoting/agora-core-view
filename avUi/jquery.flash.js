jQuery.fn.flash = function(color, backgroundColor, duration) {
  var origColor = this.css("color");
  var origBackColor = this.css("background-color");
  var selector = this;

  if (selector.attr("is-flashing") === "true") {
    return;
  }

  selector.attr("is-flashing", "true");

  selector
    .css("background-color", backgroundColor)
    .css("color", color)
    .css("display", "inline-block")
    .fadeOut(0)
    .fadeIn(duration, 'swing', function()
      {
        selector
          .css('background-color',origBackColor)
          .css('color', origColor);
        selector.attr("is-flashing", "false");
      });
};