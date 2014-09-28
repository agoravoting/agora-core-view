jQuery.fn.flash = function(color, backgroundColor, duration) {
  var origColor = this.css("color");
  var origBackColor = this.css("background-color");
  this
    .css("background-color", backgroundColor)
    .css("color", color)
    .fadeOut(0)
    .fadeIn(duration, 'swing', function()
      {
        $("#selectMoreOptsWarning")
          .css('background-color',origBackColor)
          .css('color', origColor);
      });
}