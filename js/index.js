const hints = {
  "egg-1": "Query the feline, hold your breath, and head to the four blocks.",
  "egg-2": "On Sunday, I rust away.",
  "egg-3": "On Saturday, I look past the winner.",
  "egg-4": "On Friday, I go beyond abiding.",
};
$(function () {
  if (localStorage.getItem("navigated") == "true") {
    if (localStorage.getItem("egg-5")) {
      let hint = "";
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
        `You have collected ${collectedEggs}/${eggs.length} eggs. ${hint}`,
      );
    } else {
      $(".initial")
        .text(
          "Now explore and have fun! There are 5 easter eggs for you to find, and you have't truly explored this site until you found all of them. Here's what they look like:",
        )
        .last()
        .after(() =>
          localStorage.getItem("egg-5")
            ? ""
            : `<img src="/assets/egg.png" id="egg" style="cursor: pointer;">`,
        );
    }
    $("#egg").on("mousedown", function () {
      $(this).remove();
      $("#egg-audio").get(0).play();
      localStorage.setItem("egg-5", true);
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

let ogImg = "";
let foundEgg = false;
function swap() {
  const $pfpPrimary = $(".pfp-primary");
  const $pfpSecondary = $(".pfp-secondary");

  if (foundEgg) {
    localStorage.setItem("egg-3", true);
    $("#egg-audio").get(0).play();
    $pfpPrimary.attr("src", ogImg);
    foundEgg = false;
  }

  $pfpPrimary.addClass("pfp-secondary").removeClass("pfp-primary");
  $pfpSecondary.addClass("pfp-primary").removeClass("pfp-secondary");

  if (Math.random() < 0.02 && !localStorage.getItem("egg-3")) {
    ogImg = $pfpSecondary.attr("src");
    $pfpSecondary.attr("src", "/assets/egg.png");
    foundEgg = true;
  }
}
