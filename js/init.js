// light mode = light world = boring mode
// dark mode = dark world = fun mode

const lightScheme = window.matchMedia("(prefers-color-scheme: light)").matches;
const darkMode = localStorage.getItem("dark-mode") == "true" ?? false;
document.documentElement.setAttribute("dark-mode", darkMode);
if (darkMode) {
  $("head").append('<script src="/js/fun.js"></script>');
} else {
  $("head").append('<script src="/js/boring.js"></script>');
}
