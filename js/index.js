$(function () {
  $(".pfps").on("mousedown", () => {
    const $pfpPrimary = $(".pfp-primary");
    const $pfpSecondary = $(".pfp-secondary");
    $pfpPrimary.addClass("pfp-secondary").removeClass("pfp-primary");
    $pfpSecondary.addClass("pfp-primary").removeClass("pfp-secondary");
  });
});
