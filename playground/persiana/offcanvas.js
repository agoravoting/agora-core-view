$(document).ready(function () {
  $('[data-toggle="offcanvas"]').click(function () {
    $('.row-offcanvas').toggleClass('active');
  });
});

$(document).ready(function () {
  $('.navbar-collapse').on('shown.bs.collapse', function () {
    windowHeight = $(window).innerHeight();
    $('.persiana').css('min-height', windowHeight);
  });
  $('.navbar-collapse').on('hidden.bs.collapse', function () {
    $('.persiana').css('min-height', "15px");
  });
});