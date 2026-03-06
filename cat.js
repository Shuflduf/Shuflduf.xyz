$(function () {
  $("li").prepend(`<img src="assets/listbullet.gif">`);

  const hearts = ["❤️", "🩷", "🩵", "💜", "💛"];
  let lastSpawn = 0;

  $(".images, .pfp").on("mousemove", function (e) {
    const now = Date.now();
    if (now - lastSpawn < 30) return;
    lastSpawn = now;

    const size = (Math.random() * 1.5 + 0.7).toFixed(2);
    const dy = -(Math.random() * 60 + 40).toFixed(0);
    const dx = (Math.random() * 60 - 30).toFixed(0);
    const rot = (Math.random() * 180 - 90).toFixed(0);
    const dur = (Math.random() * 0.5 + 0.7).toFixed(2);

    $("<span>", { class: "heart-particle" })
      .text(hearts[Math.floor(Math.random() * hearts.length)])
      .css({
        left: e.clientX,
        top: e.clientY,
        fontSize: size + "rem",
        animationDuration: dur + "s",
        "--dy": dy + "px",
        "--dx": dx + "px",
        "--rot": rot + "deg",
      })
      .appendTo("body")
      .on("animationend", function () {
        $(this).remove();
      });
  });
});
