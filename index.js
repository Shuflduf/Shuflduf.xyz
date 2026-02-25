$(function () {
  const infoIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>`;

  $("blockquote.callout-info").prepend(
    `<div class="callout-info-header">${infoIcon}<span>Info</span></div>`,
  );

  const tools = [{ name: "Rust" }];
});
