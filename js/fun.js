let $navlinks = null;
let navlinksDragging = false;
let dragStartY = 0;
let currentSidebarPos = 0;
const navlinksMaxOffset = 100;

$(function () {
  $("ul li")
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
      if (!localStorage.getItem("egg-4")) {
        console.log("lkdsjf");
        $(".navlinks").append(`<img src="/assets/egg.png" id="egg">`);
        $("#egg").on("mousedown", function () {
          $(this).remove();
          localStorage.setItem("egg-4", "true");
          $("#egg-audio").get(0).play();
        });
      }
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
  $navlinks = $(".navlinks");
  $navlinks.find(".grabbable").on("mousedown touchstart", startDrag);
  $(document)
    .on("mousemove", doDrag)
    .on("mouseup touchend touchcancel", endDrag);
  document.addEventListener("touchmove", doDrag, { passive: true });
}

function startDrag(e) {
  e.preventDefault();

  currentSidebarPos = parseInt($navlinks.css("top")) || 0;
  navlinksDragging = true;
  dragStartY = getClientY(e);
  $navlinks.find(".grabbable").css("cursor", "grabbing");
}

function doDrag(e) {
  if (!navlinksDragging) return;
  e.preventDefault();

  let dragOffset = dragStartY - getClientY(e);
  let newOffset = currentSidebarPos - dragOffset;
  if (newOffset < 0) {
    newOffset = 0;
  } else if (
    !localStorage.getItem("egg-4")
      ? newOffset > navlinksMaxOffset && newOffset < 300
      : newOffset > navlinksMaxOffset
  ) {
    newOffset = navlinksMaxOffset;
  }
  $navlinks.css("top", newOffset);
}

function endDrag(e) {
  if (!navlinksDragging) return;
  e.preventDefault();

  navlinksDragging = false;
  $navlinks.find(".grabbable").css("cursor", "");
}

function getClientY(e) {
  const touches = e.touches || (e.originalEvent && e.originalEvent.touches);
  if (touches) {
    return touches[0].clientY;
  }
  return e.clientY;
}
