// light mode = light world = boring mode
// dark mode = dark world = fun mode

const eggs = ["egg-1", "egg-2", "egg-3", "egg-4", "egg-5"];
const lightScheme = window.matchMedia("(prefers-color-scheme: light)").matches;
const darkMode = localStorage.getItem("dark-mode") == "true" ?? false;
document.documentElement.setAttribute("dark-mode", darkMode);
if (darkMode) {
  $("head").append('<script src="/js/fun.js"></script>');
} else {
  $("head").append('<script src="/js/boring.js"></script>');
}

function resetEggs() {
  eggs.forEach((e) => localStorage.removeItem(e));
}
