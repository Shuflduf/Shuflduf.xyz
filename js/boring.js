let sidebarPinned = localStorage.getItem("sidebar-pinned") == "true";
let navlinksOpened = false;
let sidebarDragging = false;
let dragStartX = 0;

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

  $("ul.language-chips li").each(function () {
    const icon = tools[$(this).text().trim()];
    if (icon) $(this).prepend(`<span class="${icon}"></span>`);
  });

  initializeNavlinks();
  initializeSidebar();
});

function initializeNavlinks() {
  $("#navlinks-include").load("/components/navlinks_boring.html", () => {
    if (typeof _finishedLoadingNavlinks == "function")
      _finishedLoadingNavlinks();

    $(".open-menu img").attr("src", hackclubIcon("menu", navlinksOpened, true));
    $(".open-menu").on("mousedown", () => {
      navlinksOpened = !navlinksOpened;
      $(".open-menu img").attr(
        "src",
        hackclubIcon("menu", navlinksOpened, true),
      );
      if (navlinksOpened) {
        $(".navlinks").addClass("opened");
      } else {
        $(".navlinks").removeClass("opened");
      }
    });

    $(".open-sidebar img").attr(
      "src",
      hackclubIcon("right-caret", sidebarPinned, true),
    );
    $(".open-sidebar").on("mousedown", () => {
      sidebarPinned = !sidebarPinned;
      $(".open-sidebar img").attr(
        "src",
        hackclubIcon("right-caret", sidebarPinned, true),
      );
      if (sidebarPinned) {
        $(".open-sidebar img").addClass("active");
        $(".sidebar").addClass("pinned");
      } else {
        $(".open-sidebar img").removeClass("active");
        $(".sidebar").removeClass("pinned");
      }
    });
  });
}

function initializeSidebar() {
  const $sidebar = $(".sidebar");
  $sidebar
    .wrapInner(`<div class="sidebar-content"></div>`)
    .prepend(
      `<button class="pin"><img src="${pinUrl(sidebarPinned, true)}" alt="pin"></button>`,
    )
    .append(
      `<div class="drawer"><button class="portal">Dark World</button></div>`,
    );
  if (sidebarPinned) {
    $sidebar.addClass("pinned");
  }

  $(".pin").on("mousedown", () => {
    sidebarPinned = !sidebarPinned;
    localStorage.setItem("sidebar-pinned", sidebarPinned);
    $(".pin img").attr("src", pinUrl(sidebarPinned, true));
    if (sidebarPinned) {
      $(".sidebar").addClass("pinned");
    } else {
      $(".sidebar").removeClass("pinned");
    }
  });

  let sidebarBaseWidth = $sidebar.get(0).getBoundingClientRect().width;
  let drawerMaxOffset = 200;
  let currentSidebarWidth = sidebarBaseWidth;

  $sidebar.on("mousedown", function (e) {
    if ($(e.target).closest(".pin, .portal, .open-sidebar").length) return;
    sidebarDragging = true;
    dragStartX = e.clientX;
    currentSidebarWidth = $sidebar.width();
    $sidebar.css("cursor", "grabbing");
  });

  $(document)
    .on("mousemove", function (e) {
      if (!sidebarDragging) return;

      let dragOffset = -e.clientX + dragStartX;
      let newWidth = currentSidebarWidth + dragOffset;

      if (newWidth < sidebarBaseWidth - 10) {
        newWidth = sidebarBaseWidth - 10;
      } else if (newWidth > sidebarBaseWidth + drawerMaxOffset) {
        newWidth = sidebarBaseWidth + drawerMaxOffset;
      }

      let drawerOffset = Math.max(0, newWidth - sidebarBaseWidth);
      $sidebar.find(".drawer").css("right", -200 + drawerOffset);

      dragStartX = e.clientX;
      currentSidebarWidth = newWidth;
      $sidebar.width(newWidth);
    })
    .on("mouseup", function () {
      if (sidebarDragging) {
        sidebarDragging = false;
        $sidebar.css("cursor", "");
        let currentWidth = $sidebar.width();
        if (currentWidth < sidebarBaseWidth) {
          $sidebar.css("width", "");
        }
      }
    });

  $(".portal").on("click", function () {
    localStorage.setItem("dark-mode", "true");
    location.reload();
  });
}

function hackclubIcon(icon, active, darkTheme) {
  const colour = `0x${active ? (darkTheme ? "978159" : "FF0000") : darkTheme ? "c0bcb5" : "00FF00"}`;
  return `https://icons.hackclub.com/api/icons/${colour}/${icon}`;
}

function pinUrl(fill, darkTheme) {
  return hackclubIcon(fill ? "pin-fill" : "pin", fill, darkTheme);
}
