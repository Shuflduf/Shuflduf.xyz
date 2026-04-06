// TODO: make this localstorage
let sidebarPinned = true;

$(function () {
  const infoIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>`;

  $("blockquote.callout-info").prepend(
    `<div class="callout-info-header">${infoIcon}<span>Info</span></div>`,
  );

  const tools = {
    // Backend
    RUST: "devicon-rust-original",
    GO: "devicon-go-plain",
    ZIG: "devicon-zig-original",
    C: "devicon-c-original",
    RUBY: "devicon-ruby-plain",
    KOTLIN: "devicon-kotlin-plain",
    PYTHON: "devicon-python-plain",
    PHP: "devicon-php-plain",
    JAVA: "devicon-java-plain",
    "C#": "devicon-csharp-plain",
    // Frontend
    HTML: "devicon-html5-plain",
    CSS: "devicon-css3-plain",
    JQUERY: "devicon-jquery-plain",
    TAILWIND: "devicon-tailwindcss-original",
    JAVASCRIPT: "devicon-javascript-plain",
    // Full Stack
    SVELTEKIT: "devicon-svelte-plain",
    TYPESCRIPT: "devicon-typescript-plain",
    RAILS: "devicon-rails-plain",
    LARAVEL: "devicon-laravel-original",
    ASTRO: "devicon-astro-plain",
    // Databases
    SQLITE: "devicon-sqlite-plain",
    POSTGRES: "devicon-postgresql-plain",
    MARIADB: "devicon-mariadb-original",
    MYSQL: "devicon-mysql-original",
    MONGODB: "devicon-mongodb-plain",
    // Game Development
    GODOT: "devicon-godot-plain",
    BEVY: "devicon-bevyengine-plain",
    BLENDER: "devicon-blender-original",
    UNITY: "devicon-unity-plain",
    // Shells
    ZSH: "devicon-zsh-plain",
    BASH: "devicon-bash-plain",
    POWERSHELL: "devicon-powershell-plain",
    // Operating Systems
    ARCH: "devicon-archlinux-plain",
    UBUNTU: "devicon-ubuntu-plain",
    MINT: "devicon-linuxmint-plain",
    DEBIAN: "devicon-debian-plain",
    ANDROID: "devicon-android-plain",
    WINDOWS: "devicon-windows8-original",
    OSX: "devicon-apple-original",
    // Editors
    NEOVIM: "devicon-neovim-plain",
    VIM: "devicon-vim-plain",
    VSCODE: "devicon-vscode-plain",
    "ANDROID STUDIO": "devicon-androidstudio-plain",
    JETBRAINS: "devicon-jetbrains-plain",
    // Other
    TAURI: "devicon-tauri-plain",
    WASM: "devicon-wasm-original",
    APPWRITE: "devicon-appwrite-original",
    FLUTTER: "devicon-flutter-plain",
    LUA: "devicon-lua-plain",
  };

  $("ul.language-chips li").each(() => {
    const icon = tools[$(this).text().trim()];
    if (icon) $(this).prepend(`<span class="${icon}"></span>`);
  });

  $(".pin").click(() => {
    sidebarPinned = !sidebarPinned;
    $(".pin img").attr("src", pinUrl(sidebarPinned, true));
    if (sidebarPinned) {
      $(".sidebar").addClass("pinned");
    } else {
      $(".sidebar").removeClass("pinned");
    }
  });
});

function pinUrl(fill, darkTheme) {
  const colour = `0x${fill ? (darkTheme ? "978159" : "FF0000") : darkTheme ? "c0bcb5" : "00FF00"}`;
  return `https://icons.hackclub.com/api/icons/${colour}/${fill ? "pin-fill" : "pin"}`;
}
