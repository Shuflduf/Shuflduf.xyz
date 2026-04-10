$(function () {
  // if (localStorage.getItem("navigated") != "true") {
  //   $(".initial").after(
  //     `If you've lost your way, consult <a href="/">The Guide</a>. If you've lost yourself, consult <a href="https://github.com/Shuflduf/Shuflduf.xyz?tab=readme-ov-file#stuck">The Spoilers</a>.`,
  //   );
  // }
  $.getJSON(
    "https://api.github.com/repos/Shuflduf/Shuflduf.xyz/commits?per_page=5",
    function (commits) {
      const $list = $(".updates ul").empty();
      commits.forEach(function (c) {
        const date = new Date(c.commit.author.date);
        const d = String(date.getDate()).padStart(2, "0");
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const y = String(date.getFullYear()).slice(-2);
        const href = String(c.html_url);
        const label = `${d}.${m}.${y}`;
        const msg = c.commit.message.split("\n")[0];
        if (darkMode) {
          $list.append(
            `<li><img src="assets/listbullet.gif">${msg}<sub><a href="${href}"">(${label})</a></sub></li>`,
          );
        } else {
          $list.append(
            `<li>${msg}<sub><a href="${href}"">(${label})</a></sub></li>`,
          );
        }
      });
    },
  );
});
