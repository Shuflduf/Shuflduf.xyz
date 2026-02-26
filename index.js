$(function () {
  const infoIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>`;

  $("blockquote.callout-info").prepend(
    `<div class="callout-info-header">${infoIcon}<span>Info</span></div>`,
  );

  const tools = {
    RUST: "devicon-rust-original",
    GO: "devicon-go-plain",
    ZIG: "devicon-zig-original",
    C: "devicon-c-original",
    RUBY: "devicon-ruby-plain",
    JAVA: "devicon-java-plain",
    JAVASCRIPT: "devicon-javascript-plain",
    PYTHON: "devicon-python-plain",
    HTML: "devicon-html5-plain",
    CSS: "devicon-css3-plain",
    TAILWIND: "devicon-tailwindcss-original",
    SVELTEKIT: "devicon-svelte-plain",
    JQUERY: "devicon-jquery-plain",
    ASTRO: "devicon-astro-plain",
    PHP: "devicon-php-plain",
    LARAVEL: "devicon-laravel-original",
    RAILS: "devicon-rails-plain",
    TAURI: "devicon-tauri-plain",
    GODOT: "devicon-godot-plain",
    UNITY: "devicon-unity-plain",
    BEVY: "devicon-bevyengine-plain",
    BLENDER: "devicon-blender-original",
    TYPESCRIPT: "devicon-typescript-plain",
    FLUTTER: "devicon-flutter-plain",
    KOTLIN: "devicon-kotlin-plain",
    BASH: "devicon-bash-plain",
    POWERSHELL: "devicon-powershell-plain",
    ZSH: "devicon-zsh-plain",
    "C#": "devicon-csharp-plain",
    ARCH: "devicon-archlinux-plain",
    UBUNTU: "devicon-ubuntu-plain",
    DEBIAN: "devicon-debian-plain",
    MINT: "devicon-linuxmint-plain",
    WINDOWS: "devicon-windows8-original",
    OSX: "devicon-apple-original",
    ANDROID: "devicon-android-plain",
    MYSQL: "devicon-mysql-original",
    MARIADB: "devicon-mariadb-original",
    SQLITE: "devicon-sqlite-plain",
    POSTGRES: "devicon-postgresql-plain",
    MONGODB: "devicon-mongodb-plain",
    APPWRITE: "devicon-appwrite-original",
    NEOVIM: "devicon-neovim-plain",
    "ANDROID STUDIO": "devicon-androidstudio-plain",
    VSCODE: "devicon-vscode-plain",
    JETBRAINS: "devicon-jetbrains-plain",
    WASM: "devicon-wasm-original",
    LUA: "devicon-lua-plain",
  };

  $("ul.language-chips li").each(function () {
    const icon = tools[$(this).text().trim()];
    if (icon) $(this).prepend(`<i class="${icon}"></i>`);
  });
});
