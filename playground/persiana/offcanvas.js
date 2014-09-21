
$(document).ready(function () {
  /* always collapsed navbar max height to 70% */
  $(window).resize(function() {
    var windowHeight = $(window).innerHeight();
    $('nav .collapse').css('max-height', windowHeight*0.70);
  });

  /* only show one navbar-collapse each time and change the chevron position */
  $('#selected-options').on('show.bs.collapse', function () {
    $("#search-options.in").collapse('hide');
    $(".navbar-brand .glyphicon").attr(
      "class", "glyphicon glyphicon-chevron-up white");
  });

  $('#selected-options').on('hide.bs.collapse', function () {
    $(".navbar-brand .glyphicon").attr(
      "class", "glyphicon glyphicon-chevron-down white");
  });

  $('#search-options').on('show.bs.collapse', function () {
    $("#selected-options.in").collapse('hide');
  });
});
