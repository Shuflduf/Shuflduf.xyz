const WAIT_MESSAGES = [
  "not thinkging....",
  "sleepign....",
  "hunwrgy....",
  "thinkging.... (of food)",
];

let responding = false;
let mouthOpen = false;
let eggMode = false;

function _finishedLoadingNavlinks() {
  if (darkMode) {
    $(".navlinks a[href='/projects/tetr-lang.html'] span").text("tetris");
  } else {
    $(".navlinks a[href='/projects/tetr-lang.html']").text("tetris");
  }
}

$(function () {
  $("#chat-input").on("submit", (e) => {
    e.preventDefault();
    if (responding) return;

    responding = true;

    const $input = $("#chat-input input");
    const value = $input.val();
    $input.val("");
    eggMode = value.includes("egg");
    if (eggMode) {
      $(".navlinks a[href*='tetr']").attr("href", "/assets/tree.html");
    } else {
      $(".navlinks a[href*='tree']").attr("href", "/projects/tetr-lang.html");
    }
    $(".message.user p").text(value);

    const $catResp = $(".message.cat p");
    $catResp
      .text(
        eggMode
          ? "There is a page between..."
          : WAIT_MESSAGES[Math.floor(Math.random() * WAIT_MESSAGES.length)],
      )
      .addClass("thinking");

    setTimeout(
      () => {
        $catResp.text("").removeClass("thinking");
        streamResponse($catResp);
      },
      // 500-1500
      Math.random() * 1000 + 500,
    );
  });
});

function streamResponse($catResp) {
  // 10-30
  $catResp.append("meow");
  const count = Math.floor(Math.random() * 20) + 10;
  sendNextToken($catResp, count);
}

function toggleCat(mouthOpen) {
  $(".message.cat img").attr(
    "src",
    mouthOpen ? "/assets/catgpt-open.webp" : "/assets/catgpt-closed.webp",
  );
}

function sendNextToken($catResp, remaining) {
  if (remaining <= 0) {
    responding = false;
    toggleCat(false);
    return;
  }
  if (Math.random() < 0.2) {
    $catResp.append("<br>");
    toggleCat(false);
  } else {
    $catResp.append(" meow");
    toggleCat(true);
  }
  setTimeout(
    () => sendNextToken($catResp, remaining - 1),
    // 100-200
    Math.random() * 100 + 100,
  );
}
