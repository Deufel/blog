class CodeViewer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.codeContent = "";
    this.showLineNumbers = true;
    this.wordWrap = true;
  }

  static get observedAttributes() {
    return ["src", "filename", "height"];
  }

  connectedCallback() {
    this.render();
    this.loadCode();
  }

  render() {
    const height = this.getAttribute("height") || "400px";
    const filename = this.getAttribute("filename") || "file";

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
                            transition: background 0.2s;
                        }

                        .btn:hover {
                            background: #e7edf3;
                        }

                        .btn:disabled {
                            opacity: 0.6;
                            cursor: not-allowed;
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
                            white-space: pre-wrap;
                            word-wrap: break-word;
                        }

                        pre.no-wrap {
                            white-space: pre;
                        }

                        code {
                            background: transparent;
                        }

                        .line-numbers {
                            display: table;
                            width: 100%;
                            table-layout: fixed;
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
                            vertical-align: top;
                        }

                        .line-number.hidden {
                            display: none;
                        }

                        .line-content {
                            display: table-cell;
                            padding-left: 16px;
                            width: calc(100% - 66px);
                            word-wrap: break-word;
                            vertical-align: top;
                        }

                        .line-content.full-width {
                            width: 100%;
                            padding-left: 0;
                        }

                        /* Enhanced syntax highlighting */
                        .keyword { color: #cf222e; font-weight: bold; }
                        .string { color: #032f62; }
                        .comment { color: #6e7781; font-style: italic; }
                        .tag { color: #116329; font-weight: bold; }
                        .attribute { color: #0550ae; }
                        .value { color: #032f62; }
                        .doctype { color: #6f42c1; font-weight: bold; }
                        .datastar-attr {
                            color: #8250df;
                            font-weight: bold;
                            background: rgba(130, 80, 223, 0.1);
                            padding: 1px 2px;
                            border-radius: 2px;
                        }
                        .datastar-value {
                            color: #0969da;
                            font-weight: 500;
                        }
                    </style>

                    <div class="container">
                        <div class="header">
                            <span class="filename">${filename}</span>
                            <div class="actions">
                                <button class="btn" id="copyBtn">Copy</button>
                                <button class="btn" id="toggleLines" title="Toggle line numbers">##</button>
                                <button class="btn" id="wrapBtn" title="Toggle word wrap">⟲</button>
                            </div>
                        </div>
                        <div class="content" id="content">
                            <div class="loading">Loading code...</div>
                        </div>
                    </div>
                `;

    this.setupEventListeners();
  }

  async loadCode() {
    const src = this.getAttribute("src");
    if (!src) {
      this.showError("No source URL provided");
      return;
    }

    try {
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error(
          `Failed to load: ${response.status} ${response.statusText}`,
        );
      }

      const code = await response.text();
      this.codeContent = code;
      this.displayCode(code);
    } catch (error) {
      console.error("Error loading code:", error);
      this.showError(`Failed to load code: ${error.message}`);
    }
  }

  showError(message) {
    const content = this.shadowRoot.getElementById("content");
    content.innerHTML = `<div class="error">${message}</div>`;
  }

  setupEventListeners() {
    const copyBtn = this.shadowRoot.getElementById("copyBtn");
    const toggleLines = this.shadowRoot.getElementById("toggleLines");
    const wrapBtn = this.shadowRoot.getElementById("wrapBtn");

    copyBtn?.addEventListener("click", () => this.copyCode());
    toggleLines?.addEventListener("click", () => this.toggleLineNumbers());
    wrapBtn?.addEventListener("click", () => this.toggleWordWrap());
  }

  displayCode(code) {
    const content = this.shadowRoot.getElementById("content");
    const highlightedCode = this.highlightSyntax(code);

    content.innerHTML = `<pre><code class="line-numbers">${this.addLineNumbers(highlightedCode)}</code></pre>`;
  }

  highlightSyntax(code) {
    const filename = this.getAttribute("filename") || "";

    if (filename.endsWith(".html") || filename.endsWith(".htm")) {
      return this.highlightHTML(code);
    } else if (filename.endsWith(".css")) {
      return this.highlightCSS(code);
    } else if (filename.endsWith(".js") || filename.endsWith(".ts")) {
      return this.highlightJS(code);
    } else if (filename.endsWith(".py")) {
      return this.highlightPython(code);
    }

    return this.escapeHtml(code);
  }

  highlightHTML(code) {
    let highlighted = this.escapeHtml(code);

    // Handle DOCTYPE
    highlighted = highlighted.replace(
      /(&lt;!DOCTYPE[^&gt;]*&gt;)/gi,
      '<span class="doctype">$1</span>',
    );

    // Handle comments
    highlighted = highlighted.replace(
      /(&lt;!--[\s\S]*?--&gt;)/g,
      '<span class="comment">$1</span>',
    );

    // Handle opening and closing tags
    highlighted = highlighted.replace(
      /(&lt;\/?)([\w-]+)/g,
      '$1<span class="tag">$2</span>',
    );

    // Handle data-* attributes with special highlighting
    highlighted = highlighted.replace(
      /(data-[\w-]+)(\s*=\s*)(&quot;[^&quot;]*&quot;|'[^']*')/g,
      '<span class="datastar-attr">$1</span>$2<span class="datastar-value">$3</span>',
    );

    // Handle regular attributes (but not data-* ones that were already handled)
    highlighted = highlighted.replace(
      /(?<!data-[\w-])\b([\w-]+)(\s*=\s*)(&quot;[^&quot;]*&quot;|'[^']*')/g,
      '<span class="attribute">$1</span>$2<span class="value">$3</span>',
    );

    // Handle attributes without values (like aria-selected, tabindex, etc.)
    highlighted = highlighted.replace(
      /\s([\w-]+)(?=\s|&gt;)/g,
      ' <span class="attribute">$1</span>',
    );

    // Fix any double-highlighted data attributes
    highlighted = highlighted.replace(
      /<span class="attribute">(data-[\w-]+)<\/span>/g,
      '<span class="datastar-attr">$1</span>',
    );

    return highlighted;
  }

  highlightCSS(code) {
    return this.escapeHtml(code)
      .replace(/([.#][\w-]+)/g, '<span class="tag">$1</span>')
      .replace(/([\w-]+)(\s*:)/g, '<span class="attribute">$1</span>$2')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>');
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
      "import",
      "export",
      "default",
      "async",
      "await",
      "try",
      "catch",
      "finally",
      "throw",
      "new",
      "this",
      "super",
      "static",
    ];

    let highlighted = this.escapeHtml(code);

    keywords.forEach((keyword) => {
      highlighted = highlighted.replace(
        new RegExp(`\\b${keyword}\\b`, "g"),
        `<span class="keyword">${keyword}</span>`,
      );
    });

    return highlighted
      .replace(/('[^']*'|"[^"]*"|`[^`]*`)/g, '<span class="string">$1</span>')
      .replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>');
  }

  highlightPython(code) {
    const keywords = [
      "def",
      "class",
      "if",
      "elif",
      "else",
      "for",
      "while",
      "return",
      "import",
      "from",
      "as",
      "try",
      "except",
      "finally",
      "raise",
      "with",
      "lambda",
      "and",
      "or",
      "not",
      "in",
      "is",
      "None",
      "True",
      "False",
      "async",
      "await",
    ];

    let highlighted = this.escapeHtml(code);

    keywords.forEach((keyword) => {
      highlighted = highlighted.replace(
        new RegExp(`\\b${keyword}\\b`, "g"),
        `<span class="keyword">${keyword}</span>`,
      );
    });

    return highlighted
      .replace(
        /('[^']*'|"[^"]*"|"""[\s\S]*?""")/g,
        '<span class="string">$1</span>',
      )
      .replace(/(#.*$)/gm, '<span class="comment">$1</span>');
  }

  addLineNumbers(code) {
    const lines = code.split("\n");
    const lineNumberClass = this.showLineNumbers
      ? "line-number"
      : "line-number hidden";
    const contentClass = this.showLineNumbers
      ? "line-content"
      : "line-content full-width";

    return lines
      .map(
        (line, index) =>
          `<div class="line">
                            <span class="${lineNumberClass}">${index + 1}</span>
                            <span class="${contentClass}">${line || " "}</span>
                        </div>`,
      )
      .join("");
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  async copyCode() {
    if (this.codeContent) {
      try {
        await navigator.clipboard.writeText(this.codeContent);
        const btn = this.shadowRoot.getElementById("copyBtn");
        const originalText = btn.textContent;
        btn.textContent = "Copied!";
        btn.style.background = "#dafbe1";
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = "#f6f8fa";
        }, 2000);
      } catch (err) {
        console.error("Failed to copy code:", err);
      }
    }
  }

  toggleLineNumbers() {
    this.showLineNumbers = !this.showLineNumbers;
    if (this.codeContent) {
      this.displayCode(this.codeContent);
    }
  }

  toggleWordWrap() {
    this.wordWrap = !this.wordWrap;
    const pre = this.shadowRoot.querySelector("pre");
    if (pre) {
      if (this.wordWrap) {
        pre.classList.remove("no-wrap");
      } else {
        pre.classList.add("no-wrap");
      }
    }
  }
}

customElements.define("code-viewer", CodeViewer);
