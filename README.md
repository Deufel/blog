# About
A CSS Design System

## Core Ideas
 - Responsive by default
 - Layered design system with clear boundries (see below)
 - Designed with datastar in mind for frontend reactivitivy
 - No scrolling on body element (and minimal scrolling in general is perfeared)
 - Minimal use of Z-index - Do things via the top layer instead.

## Layers

Everything must fit into one of these layers

```css
@layer css_1_reset;      /* Browser normalization */
@layer css_2_tokens;     /* All design tokens (colors, spacing, etc) */
@layer css_3_base;       /* Element defaults (html, body, h1, etc) */
@layer css_4_layout;     /* Composition primitives (grid, flex, flow) */
@layer css_5_utilities;  /* Single-purpose classes (.text-center, .bg-primary) */
@layer css_6_components; /* All components (buttons, cards, forms, nav) */
@layer css_7_exceptions; /* Context overrides */
```

### What Goes Where
Is it a browser default? → Reset
Is it a design token? → Tokens
Is it element styling? → Base
Is it layout/positioning? → Layout
Is it single-purpose? → Utilities
Is it a component? → Components
Is it an override? → Exceptions

### Where do the colors belong?
 - Layer 2 - Tokens (ALL color values)
 - Layer 3 - Base (Element defaults)
 - Layer 5 - Utilities (Flexible color classes)
 - Layer 6 - Components (Component-specific colors)

Put in Utilities when:
  - Flexible/reusable styling
  - Multiple variants needed
  - User might want to override
  - Decorative/theme-dependent

Put in Components when:
  - Essential to component function
  - Color communicates meaning/state
  - Shouldn't be easily overridden
  - Part of component identity

The 80/20 Rule
  80% of colors → Utilities (flexible theming)
  20% of colors → Components (semantic meaning)
  100% of color values → Tokens

### Layout
![Alt text](static/img/layout.png)


# CSS
inspiration from
[open props](https://open-props.style/)
[opui](https://open-props-ui.netlify.app/)
[other styles](https://deufel.github.io/css/)

# Link
[My Website](https://deufel.github.io/blog/)
