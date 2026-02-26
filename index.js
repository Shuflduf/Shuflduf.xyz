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
    PHP: "devicon-php-plain",
    JAVA: "devicon-java-plain",
    PYTHON: "devicon-python-plain",
    KOTLIN: "devicon-kotlin-plain",
    "C#": "devicon-csharp-plain",
    // Frontend
    HTML: "devicon-html5-plain",
    CSS: "devicon-css3-plain",
    JAVASCRIPT: "devicon-javascript-plain",
    JQUERY: "devicon-jquery-plain",
    TAILWIND: "devicon-tailwindcss-original",
    ASTRO: "devicon-astro-plain",
    // Full Stack
    TYPESCRIPT: "devicon-typescript-plain",
    SVELTEKIT: "devicon-svelte-plain",
    LARAVEL: "devicon-laravel-original",
    RAILS: "devicon-rails-plain",
    // Databases
    MYSQL: "devicon-mysql-original",
    MARIADB: "devicon-mariadb-original",
    SQLITE: "devicon-sqlite-plain",
    POSTGRES: "devicon-postgresql-plain",
    MONGODB: "devicon-mongodb-plain",
    // Game Development
    GODOT: "devicon-godot-plain",
    UNITY: "devicon-unity-plain",
    BEVY: "devicon-bevyengine-plain",
    BLENDER: "devicon-blender-original",
    // Shells
    BASH: "devicon-bash-plain",
    POWERSHELL: "devicon-powershell-plain",
    ZSH: "devicon-zsh-plain",
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
    "ANDROID STUDIO": "devicon-androidstudio-plain",
    VSCODE: "devicon-vscode-plain",
    JETBRAINS: "devicon-jetbrains-plain",
    // Other
    TAURI: "devicon-tauri-plain",
    APPWRITE: "devicon-appwrite-original",
    WASM: "devicon-wasm-original",
    FLUTTER: "devicon-flutter-plain",
    LUA: "devicon-lua-plain",
  };

  $("ul.language-chips li").each(function () {
    const icon = tools[$(this).text().trim()];
    if (icon) $(this).prepend(`<i class="${icon}"></i>`);
  });
});
