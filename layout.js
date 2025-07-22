// Open dialog with view transitions and remove initial focus

function openDrawer(position) {
  const drawer = document.querySelector(`body > ${position} > dialog`);
  if (!drawer) return;

  const openAction = () => {
    drawer.showModal();
    document.activeElement?.blur();
    if (window.themeUtils) window.themeUtils.init();
  };

  if (document.startViewTransition) {
    document.startViewTransition(openAction);
  } else {
    openAction();
  }
}

// Close dialog with view transitions
function closeDrawer(dialogEl, reason = "close") {
  if (!dialogEl) return;

  if (document.startViewTransition) {
    document.startViewTransition(() => dialogEl.close(reason));
  } else {
    dialogEl.close(reason);
  }
}

// Handle backdrop clicks for soft dismiss
document.addEventListener("click", (event) => {
  const dialog = event.target.closest("dialog");
  if (dialog && event.target === dialog) closeDrawer(dialog, "dismiss");
});

// Handle Escape key to close with animation
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const openDialog = document.querySelector("dialog[open]");
    if (openDialog) {
      event.preventDefault();
      closeDrawer(openDialog, "escape");
    }
  }
});

// Prevent default dialog close behavior to use our animations
document.addEventListener(
  "cancel",
  (event) => {
    if (event.target.tagName === "DIALOG") {
      event.preventDefault();
      closeDrawer(event.target, "escape");
    }
  },
  true,
);

// ---- THEME -----
(function () {
  const themeChannel = new BroadcastChannel("theme-updates");

  function applyTheme(themeMode, colorHue) {
    document.documentElement.setAttribute("data-theme", themeMode || "system");
    document.documentElement.style.setProperty(
      "--palette-hue",
      `var(--oklch-${colorHue || "cyan"})`,
    );
  }

  function loadAndApplyTheme() {
    const themeMode = localStorage.getItem("themePreference") || "system";
    const colorHue = localStorage.getItem("huePreference") || "cyan";
    applyTheme(themeMode, colorHue);
  }

  function saveThemePreference(key, value) {
    localStorage.setItem(key + "Preference", value);
    loadAndApplyTheme();
    themeChannel.postMessage({
      type: "theme-change",
      key: key + "Preference",
      value,
    });
  }

  themeChannel.onmessage = (e) => {
    if (e.data.type === "theme-change") loadAndApplyTheme();
  };

  window.selectTheme = function (theme, btn) {
    saveThemePreference("theme", theme);
    document
      .querySelectorAll("#theme-toggle button")
      .forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
  };

  window.selectColor = function (color, btn) {
    saveThemePreference("hue", color);
    document
      .querySelectorAll("#color-toggle button")
      .forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
  };

  window.saveThemePreference = saveThemePreference;

  function initThemeUI() {
    const themeMode = localStorage.getItem("themePreference") || "system";
    const colorHue = localStorage.getItem("huePreference") || "cyan";

    document
      .querySelectorAll("#theme-toggle button")
      .forEach((b) => b.classList.remove("selected"));
    const themeBtn = document.querySelector(
      `#theme-toggle button[onclick*="${themeMode}"]`,
    );
    if (themeBtn) themeBtn.classList.add("selected");

    document
      .querySelectorAll("#color-toggle button")
      .forEach((b) => b.classList.remove("selected"));
    const colorBtn = document.querySelector(
      `#color-toggle button[onclick*="${colorHue}"]`,
    );
    if (colorBtn) colorBtn.classList.add("selected");
  }

  function init() {
    loadAndApplyTheme();
    initThemeUI();
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();

  window.themeUtils = { init };
  document.addEventListener("datastar-patch-elements", () => {
    initThemeUI();
  });
})();
