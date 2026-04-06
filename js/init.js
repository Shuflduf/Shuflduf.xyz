// light mode = light world = boring mode
// dark mode = dark world = fun mode

const darkMode = localStorage.getItem("dark-mode") || false;
document.documentElement.setAttribute("dark-mode", darkMode);
