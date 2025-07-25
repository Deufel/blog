class GitHubCodeViewer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["src", "filename", "height", "max-lines", "theme"];
  }

  connectedCallback() {
    this.render();
    this.loadCode();
  }

  attributeChangedCallback() {
    if (this.shadowRoot) {
      this.render();
      this.loadCode();
    }
  }

  render() {
    const height = this.getAttribute("height") || "400px";
    const filename = this.getAttribute("filename") || "file";
    const theme = this.getAttribute("theme") || "light";

    this.shadowRoot.innerHTML = `
              <style>
                  :host {
                      display: block;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                  }

                  .container {
                      border: 1px solid #d0d7de;
                      border-radius: 6px;
                      overflow: hidden;
                      background: white;
                  }

                  .header {
                      background: #f6f8fa;
                      padding: 8px 16px;
                      border-bottom: 1px solid #d0d7de;
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      font-size: 14px;
                  }

                  .filename {
                      font-weight: 600;
                      color: #24292f;
                  }

                  .actions {
                      display: flex;
                      gap: 8px;
                  }

                  .btn {
                      padding: 4px 8px;
                      font-size: 12px;
                      border: 1px solid #d0d7de;
                      border-radius: 4px;
                      background: #f6f8fa;
                      cursor: pointer;
                      color: #24292f;
                  }

                  .btn:hover {
                      background: #e7edf3;
                  }

                  .content {
                      height: ${height};
                      overflow: auto;
                      background: #f6f8fa;
                  }

                  .loading {
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      height: 100%;
                      color: #656d76;
                  }

                  .error {
                      padding: 20px;
                      background: #fff8f0;
                      border-left: 4px solid #fb8500;
                      margin: 16px;
                      border-radius: 4px;
                      color: #24292f;
                  }

                  pre {
                      margin: 0;
                      padding: 16px;
                      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
                      font-size: 13px;
                      line-height: 1.45;
                      color: #24292f;
                      background: transparent;
                      overflow-x: auto;
                  }

                  code {
                      background: transparent;
                  }

                  .line-numbers {
                      display: table;
                      width: 100%;
                  }

                  .line {
                      display: table-row;
                  }

                  .line-number {
                      display: table-cell;
                      width: 50px;
                      padding-right: 16px;
                      text-align: right;
                      color: #656d76;
                      user-select: none;
                      border-right: 1px solid #d0d7de;
                  }

                  .line-content {
                      display: table-cell;
                      padding-left: 16px;
                      width: 100%;
                  }

                  /* Basic syntax highlighting */
                  .keyword { color: #cf222e; }
                  .string { color: #032f62; }
                  .comment { color: #6e7781; font-style: italic; }
                  .tag { color: #116329; }
                  .attribute { color: #0550ae; }
                  .value { color: #032f62; }
              </style>

              <div class="container">
                  <div class="header">
                      <span class="filename">${filename}</span>
                      <div class="actions">
                          <button class="btn" id="copyBtn">Copy</button>
                          <button class="btn" id="rawBtn">View Raw</button>
                      </div>
                  </div>
                  <div class="content" id="content">
                      <div class="loading">Loading...</div>
                  </div>
              </div>
          `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const copyBtn = this.shadowRoot.getElementById("copyBtn");
    const rawBtn = this.shadowRoot.getElementById("rawBtn");

    copyBtn?.addEventListener("click", () => this.copyCode());
    rawBtn?.addEventListener("click", () => this.openRaw());
  }

  async loadCode() {
    const src = this.getAttribute("src");
    if (!src) return;

    const content = this.shadowRoot.getElementById("content");

    try {
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const code = await response.text();
      this.codeContent = code;

      const maxLines = parseInt(this.getAttribute("max-lines")) || null;
      const lines = code.split("\n");
      const displayLines = maxLines ? lines.slice(0, maxLines) : lines;

      const highlightedCode = this.highlightSyntax(displayLines.join("\n"));

      content.innerHTML = `
                  <pre><code class="line-numbers">${this.addLineNumbers(highlightedCode)}</code></pre>
                  ${
                    maxLines && lines.length > maxLines
                      ? `<div style="padding: 8px 16px; background: #fff8dc; border-top: 1px solid #d0d7de; font-size: 12px; color: #656d76;">
                          Showing first ${maxLines} lines of ${lines.length} total lines
                      </div>`
                      : ""
                  }
              `;
    } catch (error) {
      content.innerHTML = `
                  <div class="error">
                      <strong>Error loading code:</strong> ${error.message}<br><br>
                      <em>URL:</em> ${src}
                  </div>
              `;
    }
  }

  highlightSyntax(code) {
    const filename = this.getAttribute("filename") || "";

    if (filename.endsWith(".html") || filename.endsWith(".htm")) {
      return this.highlightHTML(code);
    } else if (filename.endsWith(".css")) {
      return this.highlightCSS(code);
    } else if (filename.endsWith(".js")) {
      return this.highlightJS(code);
    }

    return this.escapeHtml(code);
  }

  highlightHTML(code) {
    return this.escapeHtml(code)
      .replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="tag">$2</span>')
      .replace(/([\w-]+)(=)/g, '<span class="attribute">$1</span>$2')
      .replace(/=("[^"]*")/g, '=<span class="value">$1</span>')
      .replace(/(&lt;!--.*?--&gt;)/g, '<span class="comment">$1</span>');
  }

  highlightCSS(code) {
    return this.escapeHtml(code)
      .replace(/([.#][\w-]+)/g, '<span class="tag">$1</span>')
      .replace(/([\w-]+)(\s*:)/g, '<span class="attribute">$1</span>$2')
      .replace(/(:[ ]*[^;]+)/g, ':<span class="value">$1</span>'.substring(1))
      .replace(/(\/\*.*?\*\/)/g, '<span class="comment">$1</span>');
  }

  highlightJS(code) {
    const keywords = [
      "function",
      "var",
      "let",
      "const",
      "if",
      "else",
      "for",
      "while",
      "return",
      "class",
      "extends",
    ];
    let highlighted = this.escapeHtml(code);

    keywords.forEach((keyword) => {
      highlighted = highlighted.replace(
        new RegExp(`\\b${keyword}\\b`, "g"),
        `<span class="keyword">${keyword}</span>`,
      );
    });

    return highlighted
      .replace(/('[^']*'|"[^"]*")/g, '<span class="string">$1</span>')
      .replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>');
  }

  addLineNumbers(code) {
    const lines = code.split("\n");
    return lines
      .map(
        (line, index) =>
          `<div class="line">
                  <span class="line-number">${index + 1}</span>
                  <span class="line-content">${line || " "}</span>
              </div>`,
      )
      .join("");
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  copyCode() {
    if (this.codeContent) {
      navigator.clipboard.writeText(this.codeContent).then(() => {
        const btn = this.shadowRoot.getElementById("copyBtn");
        const originalText = btn.textContent;
        btn.textContent = "Copied!";
        btn.style.background = "#dafbe1";
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = "#f6f8fa";
        }, 2000);
      });
    }
  }

  openRaw() {
    const src = this.getAttribute("src");
    if (src) {
      window.open(src, "_blank");
    }
  }
}

customElements.define("github-code-viewer", GitHubCodeViewer);
