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

                        /* Enhanced Datastar attribute highlighting */
                        .datastar-attr {
                            color: #8250df;
                            font-weight: bold;
                            background: linear-gradient(90deg, rgba(130, 80, 223, 0.15) 0%, rgba(130, 80, 223, 0.08) 100%);
                            padding: 1px 3px;
                            border-radius: 3px;
                            border-left: 2px solid #8250df;
                        }

                        .datastar-value {
                            color: #0969da;
                            font-weight: 500;
                            background: rgba(9, 105, 218, 0.08);
                            padding: 1px 2px;
                            border-radius: 2px;
                        }

                        .datastar-signal {
                            color: #e36209;
                            font-weight: bold;
                            background: rgba(227, 98, 9, 0.1);
                            padding: 0 1px;
                            border-radius: 2px;
                        }

                        .datastar-action {
                            color: #d1242f;
                            font-weight: bold;
                            background: rgba(209, 36, 47, 0.1);
                            padding: 0 1px;
                            border-radius: 2px;
                        }

                        .datastar-modifier {
                            color: #6f42c1;
                            font-weight: 500;
                            font-style: italic;
                        }

                        /* Pro attribute highlighting */
                        .datastar-pro-attr {
                            color: #d4a72c;
                            font-weight: bold;
                            background: linear-gradient(90deg, rgba(212, 167, 44, 0.15) 0%, rgba(212, 167, 44, 0.08) 100%);
                            padding: 1px 3px;
                            border-radius: 3px;
                            border-left: 2px solid #d4a72c;
                            position: relative;
                        }

                        .datastar-pro-attr::after {
                            content: "PRO";
                            position: absolute;
                            top: -8px;
                            right: -2px;
                            font-size: 8px;
                            color: #d4a72c;
                            font-weight: bold;
                            opacity: 0.7;
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
      // Handle data URLs
      if (src.startsWith("data:")) {
        const code = decodeURIComponent(src.split(",")[1] || "");
        this.codeContent = code;
        this.displayCode(code);
        return;
      }

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

    // Define Datastar core attributes
    const coreDatastarAttrs = [
      "data-attr",
      "data-bind",
      "data-class",
      "data-computed",
      "data-effect",
      "data-ignore",
      "data-ignore-morph",
      "data-indicator",
      "data-json-signals",
      "data-on",
      "data-on-intersect",
      "data-on-interval",
      "data-on-load",
      "data-on-signal-patch",
      "data-on-signal-patch-filter",
      "data-preserve-attr",
      "data-ref",
      "data-show",
      "data-signals",
      "data-style",
      "data-text",
    ];

    // Define Datastar Pro attributes
    const proDatastarAttrs = [
      "data-animate",
      "data-custom-validity",
      "data-on-raf",
      "data-on-resize",
      "data-persist",
      "data-query-string",
      "data-replace-url",
      "data-scroll-into-view",
      "data-view-transition",
    ];

    // Enhanced Datastar attribute highlighting with modifiers and sub-attributes
    // Handle core Datastar attributes with their variations and modifiers
    coreDatastarAttrs.forEach((attr) => {
      const baseAttr = attr.replace("data-", "");

      // Match the attribute with optional suffixes, modifiers, and values
      const regex = new RegExp(
        `(${attr}(?:-[\\w-]+)*(?:__[\\w.-]+)*)\\s*=\\s*(&quot;[^&quot;]*&quot;|'[^']*')`,
        "gi",
      );

      highlighted = highlighted.replace(regex, (match, attrName, attrValue) => {
        // Highlight the attribute value content for Datastar expressions
        const highlightedValue = this.highlightDatastarExpression(attrValue);
        return `<span class="datastar-attr">${attrName}</span>=<span class="datastar-value">${highlightedValue}</span>`;
      });
    });

    // Handle Pro attributes with special styling
    proDatastarAttrs.forEach((attr) => {
      const regex = new RegExp(
        `(${attr}(?:-[\\w-]+)*(?:__[\\w.-]+)*)\\s*=\\s*(&quot;[^&quot;]*&quot;|'[^']*')`,
        "gi",
      );

      highlighted = highlighted.replace(regex, (match, attrName, attrValue) => {
        const highlightedValue = this.highlightDatastarExpression(attrValue);
        return `<span class="datastar-pro-attr">${attrName}</span>=<span class="datastar-value">${highlightedValue}</span>`;
      });
    });

    // Handle generic data-* attributes that might be custom Datastar extensions
    highlighted = highlighted.replace(
      /(data-[\w-]+(?:__[\w.-]+)*)(\s*=\s*)(&quot;[^&quot;]*&quot;|'[^']*')/g,
      (match, attrName, equals, attrValue) => {
        // If it's not already highlighted as a core or pro attribute
        if (!match.includes('<span class="datastar-')) {
          const highlightedValue = this.highlightDatastarExpression(attrValue);
          return `<span class="datastar-attr">${attrName}</span>${equals}<span class="datastar-value">${highlightedValue}</span>`;
        }
        return match;
      },
    );

    // Handle regular attributes (but not data-* ones that were already handled)
    highlighted = highlighted.replace(
      /(?<!<span class="[\w-]*">)([\w-]+)(\s*=\s*)(&quot;[^&quot;]*&quot;|'[^']*')/g,
      (match, attrName, equals, attrValue) => {
        if (!attrName.startsWith("data-")) {
          return `<span class="attribute">${attrName}</span>${equals}<span class="value">${attrValue}</span>`;
        }
        return match;
      },
    );

    // Handle attributes without values
    highlighted = highlighted.replace(
      /\s([\w-]+)(?=\s|&gt;)/g,
      (match, attrName) => {
        if (attrName.startsWith("data-")) {
          return ` <span class="datastar-attr">${attrName}</span>`;
        }
        return ` <span class="attribute">${attrName}</span>`;
      },
    );

    return highlighted;
  }

  highlightDatastarExpression(attrValue) {
    // Remove quotes for processing
    let content = attrValue.slice(1, -1); // Remove surrounding quotes
    let highlighted = content;

    // Highlight signals ($variable)
    highlighted = highlighted.replace(
      /(\$[\w.]+)/g,
      '<span class="datastar-signal">$1</span>',
    );

    // Highlight actions (@action)
    highlighted = highlighted.replace(
      /(@[\w]+)/g,
      '<span class="datastar-action">$1</span>',
    );

    // Highlight modifiers (__modifier.tag)
    highlighted = highlighted.replace(
      /(__)([\\w.-]+)/g,
      '$1<span class="datastar-modifier">$2</span>',
    );

    // Return with quotes
    return (
      attrValue.charAt(0) + highlighted + attrValue.charAt(attrValue.length - 1)
    );
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
