$(function () {
  $("li")
    .wrapInner("<span></span>")
    .prepend(`<img src="/assets/listbullet.gif">`);
  $("#navbar-include").load("/components/navbar.html");
  $("#navlinks-include").load("/components/navlinks.html", function () {
    $(".navlinks a")
      .wrapInner("<span></span>")
      .prepend('<img src="/assets/chevron.gif">');
    if (typeof _finishedLoadingNavlinks == "function")
      _finishedLoadingNavlinks();
  });
});
