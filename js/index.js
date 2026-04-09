const hints = {
  "egg-1": "Query the feline, hold your breath, and head to the blocks.",
  "egg-2": "On Sunday, I ",
};
$(function () {
  if (localStorage.getItem("navigated") == "true") {
    if (localStorage.getItem("egg-3")) {
      let hint = "";
      const eggs = ["egg-1", "egg-2", "egg-3", "egg-4", "egg-5"];
      const collectedEggs = eggs.reduce((accum, current) => {
        if (localStorage.getItem(current)) {
          return accum + (localStorage.getItem(current) ? 1 : 0);
        } else {
          hint = hints[current];
          return accum;
        }
      }, 0);
      console.log(collectedEggs);
      $(".initial").text(
        `You have collected ${collectedEggs}/${eggs.length} eggs. Your next hint is: ${hint}`,
      );
    } else {
      $(".initial")
        .text(
          "Now explore and have fun! There are 5 easter eggs for you to find, and you have't truly explored this site until you found all of them. Here's what they look like:",
        )
        .after(() =>
          localStorage.getItem("egg-3")
            ? ""
            : `<img src="/assets/egg.png" id="egg">`,
        );
    }
    $("#egg").on("mousedown", function () {
      $(this).remove();
      $("#egg-audio").get(0).play();
      localStorage.setItem("egg-3", true);
    });
  } else if ("navigated" in localStorage) {
    $(".initial").html(
      "Welcome back! It seems you're lost. You can <i>find yourself</i> by pulling the sidebar out.",
    );
  } else {
    localStorage.setItem("navigated", "false");
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
