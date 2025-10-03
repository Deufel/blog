# CSS Design System

A pragmatic, layer-based CSS architecture built on [Open Props](https://open-props.style/), and [Open Props UI](https://open-props-ui.netlify.app/) with [CUBE](https://cube.fyi/) methodology principles.

Utilizing [Datastar](https://data-star.dev/) signlas in a few places.

---

## Philosophy

This system prioritizes:
- **Clear boundaries** - Strict layer separation prevents cascade conflicts
- **Progressive enhancement** - Start minimal, add complexity only when needed
- **Composition over configuration** - Build with primitives, not prebuilt components
- **Discipline over restriction** - Open Props has 15 sizes; use 3-5 consistently

---

## Core Principles

### 1. Layered Architecture
CSS cascade layers enforce architectural boundaries. Each layer has a single responsibility.

### 2. Open Props Foundation
Use Open Props tokens directly. No wrapper abstractions. Rely on discipline to limit token usage consistently.

### 3. CUBE-Inspired Structure
- **Composition** - Layout primitives (reusable patterns)
- **Utilities** - Single-purpose atomic classes
- **Blocks** - Components
- **Exceptions** - One-off overrides

### 4. Automatic Theme Adaptation
All colors use `light-dark()` for system preference detection. Manual theme override available via `color-scheme` property.

### 5. App-First Layout
Fixed viewport with scrollable regions. No body scroll. Popovers and dialogs use native top layer.

### 6. Datastar Integration
Reactive state management via Datastar signals. Conditional rendering based on viewport width and application state.

---

## Layer Architecture

```css
@layer reset;        /* Layer 1: Browser normalization */
@layer tokens;       /* Layer 2: Open Props imports */
@layer themes;       /* Layer 3: Semantic color mapping */
@layer base;         /* Layer 4: Element defaults */
@layer page;         /* Layer 5: App structural layouts */
@layer composition;  /* Layer 6: Reusable layout primitives */
@layer utilities;    /* Layer 7: Atomic classes */
@layer blocks;       /* Layer 8: Components */
@layer exceptions;   /* Layer 9: Override escape hatch */
```

---

## Layer Definitions

### Layer 1: Reset
**Purpose:** Normalize browser inconsistencies

**Contains:**
- Box-sizing rules
- Margin/padding resets
- Focus-visible defaults
- Form inheritance fixes

**Example:**
```css
@layer reset {
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body, h1, h2, h3, h4, p, figure {
    margin: 0;
  }
}
```

---

### Layer 2: Tokens
**Purpose:** Import Open Props design tokens

**Contains:**
- Open Props CSS imports
- No custom tokens

**Example:**
```css
@layer tokens {
  @import "https://unpkg.com/open-props";
  @import "https://unpkg.com/open-props/normalize.min.css";
}
```

**Token Usage Discipline:**
Use Open Props variables directly. Favor consistency over variety:
- **Spacing:** Use `--size-2`, `--size-4`, `--size-8` primarily
- **Typography:** Use `--font-size-1` through `--font-size-4` primarily
- **Colors:** Use full Open Props color scales with `light-dark()`

Having 15 available tokens doesn't mean using all 15. Pick your subset and stick to it.

---

### Layer 3: Themes
**Purpose:** Map tokens to semantic meanings with automatic theming

**Contains:**
- Color assignments using `light-dark()`
- Theme-specific values
- Manual theme overrides (optional)

**Example:**
```css
@layer themes {
  :root {
    color-scheme: light dark;

    --color-primary: light-dark(var(--blue-6), var(--blue-4));
    --color-text: light-dark(var(--gray-9), var(--gray-1));
    --color-surface: light-dark(var(--gray-0), var(--gray-9));
    --color-border: light-dark(var(--gray-3), var(--gray-7));
  }

  /* Manual override */
  [data-theme='dark'] {
    color-scheme: dark;
  }
}
```

**Rules:**
- ALL colors MUST use `light-dark()`
- Reference Open Props colors only
- Semantic naming only in this layer

---

### Layer 4: Base
**Purpose:** Style HTML elements with no classes

**Contains:**
- Typography defaults
- Semantic element styling
- Form element normalization

**Does NOT contain:**
- Layout rules
- Page structure
- Component patterns

**Example:**
```css
@layer base {
  body {
    font-family: var(--font-sans);
    font-size: var(--font-size-1);
    line-height: var(--font-lineheight-3);
    color: var(--color-text);
    background: var(--color-surface);
  }

  h1 { font-size: var(--font-size-6); }
  h2 { font-size: var(--font-size-5); }

  small { font-size: 0.875em; }
  strong { font-weight: var(--font-weight-7); }
}
```

---

### Layer 5: Page
**Purpose:** App-specific structural layouts

**Contains:**
- Fixed viewport app shells
- Page-level grid systems
- Structural responsive breakpoints

**Does NOT contain:**
- Reusable layout primitives (use composition)
- Component styling (use blocks)
- Decorative styles

**Example:**
```css
@layer page {
  .page-app-shell {
    display: grid;
    grid-template-areas:
      "header header header"
      "nav main aside"
      "footer footer footer";
    grid-template-rows: auto 1fr auto;
    grid-template-columns: auto 1fr auto;
    height: 100dvh;
    overflow: hidden;
  }

  .page-app-shell > header { grid-area: header; }
  .page-app-shell > nav {
    grid-area: nav;
    overflow-y: auto;
  }
  .page-app-shell > main {
    grid-area: main;
    overflow-y: auto;
  }
  .page-app-shell > aside {
    grid-area: aside;
    overflow-y: auto;
  }

  @media (max-width: 640px) {
    .page-app-shell {
      grid-template-areas:
        "header"
        "main"
        "footer";
      grid-template-columns: 1fr;
    }
  }
}
```

**Why separate from Composition?**
Page layouts are app-specific and opinionated. Composition primitives are generic and reusable. This separation allows future page variations without touching composition.

---

### Layer 6: Composition
**Purpose:** Reusable layout primitives (CUBE Composition)

**Contains:**
- Layout patterns (Stack, Cluster, Sidebar, Grid)
- Whitespace and positioning only
- Content-agnostic patterns

**Does NOT contain:**
- Colors, borders, shadows
- Component-specific styling
- Page structure

**Example:**
```css
@layer composition {
  /* Stack - Vertical rhythm */
  .stack {
    display: flex;
    flex-direction: column;
  }

  .stack > * + * {
    margin-block-start: var(--stack-space, var(--size-4));
  }

  /* Cluster - Horizontal wrapping */
  .cluster {
    display: flex;
    flex-wrap: wrap;
    gap: var(--cluster-space, var(--size-3));
    align-items: center;
  }

  /* Sidebar - Content + aside */
  .sidebar {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--sidebar-gap, var(--size-5));
  }

  /* Auto Grid - Responsive columns */
  .grid-auto {
    display: grid;
    grid-template-columns: repeat(
      auto-fit,
      minmax(min(var(--grid-min, 250px), 100%), 1fr)
    );
    gap: var(--grid-gap, var(--size-4));
  }
}
```

**Usage:**
```html
<div class="stack">
  <h2>Title</h2>
  <p>Content with automatic spacing</p>
  <button>Action</button>
</div>
```

---

### Layer 7: Utilities
**Purpose:** Single-purpose atomic classes

**Contains:**
- One property per class
- Open Props values
- High specificity by design

**Example:**
```css
@layer utilities {
  /* Padding */
  .p-2 { padding: var(--size-2); }
  .p-4 { padding: var(--size-4); }
  .px-4 { padding-inline: var(--size-4); }
  .py-2 { padding-block: var(--size-2); }

  /* Text */
  .text-1 { font-size: var(--font-size-1); }
  .text-center { text-align: center; }
  .weight-6 { font-weight: var(--font-weight-6); }

  /* Colors */
  .color-primary { color: var(--color-primary); }
  .bg-surface { background: var(--color-surface); }

  /* Layout */
  .flex { display: flex; }
  .items-center { align-items: center; }
  .gap-3 { gap: var(--size-3); }

  /* Border */
  .radius-2 { border-radius: var(--radius-2); }
  .border-1 { border: var(--border-size-1) solid var(--color-border); }
}
```

**Usage:** Compose utilities in HTML rather than writing custom CSS.

---

### Layer 8: Blocks
**Purpose:** Components (CUBE Blocks)

**Contains:**
- Multi-property patterns
- Semantic component classes
- Composed styling

**Example:**
```css
@layer blocks {
  .btn {
    display: inline-flex;
    align-items: center;
    gap: var(--size-2);
    padding: var(--size-2) var(--size-4);
    font-weight: var(--font-weight-6);
    border: none;
    border-radius: var(--radius-2);
    background: var(--color-primary);
    color: white;
    cursor: pointer;
    transition: transform var(--ease-2);
  }

  .btn:hover {
    transform: translateY(-1px);
  }

  .card {
    padding: var(--size-5);
    background: var(--color-surface);
    border: var(--border-size-1) solid var(--color-border);
    border-radius: var(--radius-3);
  }
}
```

**When to use blocks vs utilities:**
- Simple one-offs: Use utilities
- Repeated patterns: Create a block
- Interactive states: Create a block

---

### Layer 9: Exceptions
**Purpose:** Escape hatch for one-off overrides

**Contains:**
- Context-specific fixes
- Temporary patches
- Well-documented exceptions

**Example:**
```css
@layer exceptions {
  /* Legacy table needs extra padding - remove when redesigned */
  .legacy-data-table td {
    padding: var(--size-3);
  }
}
```

**Rules:**
- Document WHY the exception exists
- Include removal conditions
- Use sparingly

---

## Decision Tree

```
Does it normalize browsers?
  → Layer 1: Reset

Is it from Open Props?
  → Layer 2: Tokens

Is it mapping colors to semantic names?
  → Layer 3: Themes

Is it styling HTML elements (no classes)?
  → Layer 4: Base

Is it app-specific page structure?
  → Layer 5: Page

Is it a reusable layout primitive?
  → Layer 6: Composition

Is it a single-purpose utility?
  → Layer 7: Utilities

Is it a multi-property component?
  → Layer 8: Blocks

Is it a one-off exception?
  → Layer 9: Exceptions (document why!)
```

---

## File Structure

```
css/
├── layers/
│   ├── 1-reset.css
│   ├── 2-tokens.css
│   ├── 3-themes.css
│   ├── 4-base.css
│   ├── 5-page.css
│   ├── 6-composition.css
│   ├── 7-utilities.css
│   ├── 8-blocks.css
│   └── 9-exceptions.css
└── main.css  (imports all layers in order)
```

**main.css:**
```css
@import './layers/1-reset.css';
@import './layers/2-tokens.css';
@import './layers/3-themes.css';
@import './layers/4-base.css';
@import './layers/5-page.css';
@import './layers/6-composition.css';
@import './layers/7-utilities.css';
@import './layers/8-blocks.css';
@import './layers/9-exceptions.css';
```

---

## Best Practices

### DO
- Start with utilities, promote to blocks when patterns emerge
- Use Open Props tokens directly (no wrapper variables)
- Limit yourself to 3-5 token values per category in practice
- Compose from primitives before creating custom components
- Document all exceptions in Layer 9
- Use `light-dark()` for ALL colors
- Let semantic HTML drive sizing (`<small>`, `<strong>`, headings)

### DON'T
- Skip layers or merge concerns
- Create wrapper variables around Open Props
- Use all 15 available token sizes just because they exist
- Mix layout (composition) with decoration (blocks)
- Add arbitrary custom tokens
- Manually theme-switch colors (use `light-dark()`)
- Use z-index (use popovers and top layer)

---

## Datastar Integration

Reactive patterns for viewport-aware layouts:

```html
<body
  data-signals="{windowWidth: window.innerWidth}"
  data-on-windowresize="$$windowWidth = evt.detail.width"
>
  <nav
    id="nav"
    data-attr-popover="$windowWidth < 641 ? 'auto' : null"
  >
    <!-- Nav becomes popover on mobile -->
  </nav>

  <button
    data-show="$windowWidth < 641"
    data-on-click="$nav.togglePopover()"
  >
    Menu
  </button>
</body>

<script>
  addEventListener('resize', () =>
    document.body.dispatchEvent(new CustomEvent('windowresize', {
      detail: { width: innerWidth }
    }))
  );
</script>
```

---


## Version

**Current:** v0.1.0
**Status:** development
**Last Updated:** 2025

---

## Contributing

When adding CSS, always ask:
1. Which layer does this belong in? (Use the decision tree)
2. Am I using too many different token values?
3. Can composition primitives + utilities solve this?
4. Should this be promoted from utilities to a block?

The layer system only works if boundaries are enforced. When in doubt, start in utilities and promote later.
