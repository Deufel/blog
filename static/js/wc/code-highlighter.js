import { getHighlighter } from "https://esm.sh/shiki@1.0.0";

class CodeHighlighter extends HTMLElement {
  constructor() {
    super();
    this.highlighter = null;
    this.currentTheme = "github-light";
  }

  static get observedAttributes() {
    return ["language", "theme"];
  }

  async connectedCallback() {
    // Get the code content
    const code = this.textContent.trim();

    // Get language from attribute or try to detect
    const language = this.getAttribute("language") || "javascript";

    // Determine theme based on your theme system
    const theme = this.getThemeFromSystem();

    // Initialize Shiki
    if (!this.highlighter) {
      this.highlighter = await getHighlighter({
        themes: [
          "github-light",
          "github-dark",
          "vitesse-light",
          "vitesse-dark",
        ],
        langs: [
          "javascript",
          "typescript",
          "python",
          "html",
          "css",
          "json",
          "bash",
          "sql",
        ],
      });
    }

    // Highlight the code
    this.renderHighlightedCode(code, language, theme);

    // Watch for theme changes
    this.observeThemeChanges();
  }

  getThemeFromSystem() {
    const root = document.documentElement;
    const themeMode = root.getAttribute("data-theme-mode");

    if (themeMode === "dark") {
      return "github-dark";
    } else if (themeMode === "light") {
      return "github-light";
    } else {
      // System mode - check prefers-color-scheme
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "github-dark"
        : "github-light";
    }
  }

  renderHighlightedCode(code, language, theme) {
    if (!this.highlighter) return;

    try {
      const html = this.highlighter.codeToHtml(code, {
        lang: language,
        theme: theme,
      });

      this.innerHTML = html;
      this.currentTheme = theme;
    } catch (error) {
      console.error("Shiki highlighting error:", error);
      // Fallback to plain code block
      this.innerHTML = `<pre><code>${this.escapeHtml(code)}</code></pre>`;
    }
  }

  observeThemeChanges() {
    // Watch for changes to the theme mode attribute
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          (mutation.attributeName === "data-theme-mode" ||
            mutation.attributeName === "data-theme-color")
        ) {
          this.updateTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme-mode", "data-theme-color"],
    });

    // Also listen to system color scheme changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => {
        if (
          document.documentElement.getAttribute("data-theme-mode") === "system"
        ) {
          this.updateTheme();
        }
      });
  }

  updateTheme() {
    const newTheme = this.getThemeFromSystem();
    if (newTheme !== this.currentTheme) {
      const code =
        this.querySelector("code")?.textContent || this.textContent.trim();
      const language = this.getAttribute("language") || "javascript";
      this.renderHighlightedCode(code, language, newTheme);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "language" && this.highlighter) {
      const code =
        this.querySelector("code")?.textContent || this.textContent.trim();
      const theme = this.getThemeFromSystem();
      this.renderHighlightedCode(code, newValue, theme);
    }
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Register the custom element
customElements.define("code-highlighter", CodeHighlighter);
