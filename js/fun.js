let navlinksDragging = false;
let dragStartY = 0;
let currentSidebarPos = 0;
const navlinksMaxOffset = 100;

$(function () {
  $("li")
    .wrapInner("<span></span>")
    .prepend(`<img src="/assets/listbullet.gif">`);
  $("#navbar-include").load("/components/navbar.html");
  $.get("/components/navlinks.html")
    .done(function (html) {
      $("#navlinks-include").replaceWith(html);
    })
    .done(function () {
      $(".navlinks a")
        .wrapInner("<span></span>")
        .prepend('<img src="/assets/chevron.gif">');
      initializeDragging();
      $(".portal").on("click", function () {
        localStorage.setItem("navigated", "true");
        localStorage.setItem("dark-mode", "false");
        location.reload();
      });
      if (typeof _finishedLoadingNavlinks == "function")
        _finishedLoadingNavlinks();
    });
  $("hr").replaceWith(
    `<img class="seperator" src="assets/seperator.gif" alt="seperator">`,
  );
});

function initializeDragging() {
  const $navlinks = $(".navlinks");
  console.log($navlinks.find(".grabbable"));
  $navlinks.find(".grabbable").on("mousedown touchstart", function (e) {
    e.preventDefault();

    currentSidebarPos = parseInt($navlinks.css("top")) || 0;
    navlinksDragging = true;
    dragStartY = getClientY(e);
    $navlinks.css("cursor", "grabbing");
  });
  $(document)
    .on("mousemove touchmove", function (e) {
      if (!navlinksDragging) return;
      e.preventDefault();

      let dragOffset = dragStartY - getClientY(e);
      let newOffset = currentSidebarPos - dragOffset;
      if (newOffset < 0) {
        newOffset = 0;
      } else if (newOffset > navlinksMaxOffset) {
        newOffset = navlinksMaxOffset;
      }
      $navlinks.css("top", newOffset);
    })
    .on("mouseup touchend touchcancel", function (e) {
      if (!navlinksDragging) return;
      e.preventDefault();

      navlinksDragging = false;
      $navlinks.css("cursor", "");
    });
}

function getClientY(e) {
  if (e.originalEvent.touches) {
    return e.originalEvent.touches[0].clientY;
  }
  return e.clientY;
}
