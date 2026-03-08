$(function () {
  $("li").prepend(`<img src="/assets/listbullet.gif">`);
  $("#navbar-include").load("/components/navbar.html");
  $("#navlinks-include").load("/components/navlinks.html", function () {
    $(".navlinks a").prepend('<img src="/assets/chevron.gif">');
  });
});
