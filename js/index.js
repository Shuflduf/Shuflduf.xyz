$(function () {
  if (localStorage.getItem("navigated")) {
    $(".initial").text("Now explore!");
  }
  if (darkMode) {
    swap();
  }

  $(".pfps").on("mousedown", () => {
    swap();
  });
});

function swap() {
  const $pfpPrimary = $(".pfp-primary");
  const $pfpSecondary = $(".pfp-secondary");
  $pfpPrimary.addClass("pfp-secondary").removeClass("pfp-primary");
  $pfpSecondary.addClass("pfp-primary").removeClass("pfp-secondary");
}
