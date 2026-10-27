# Portfolio Theme Architecture Guide

## Overview
The portfolio styling architecture is built upon a single-source-of-truth **design token system** (`public/css/tokens.css`) and a dynamic **theme registry** (`public/js/theme-registry.js`).

### Guiding Principles
1. **Content Independence**: All project copy, skills, and bio information live strictly in the data layer (`src/data/*`). Themes modify presentation, typography, color palettes, and component chrome, never copy.
2. **Zero-FOUC Default**: The default theme (`obsidian`) requires zero auxiliary stylesheet downloads. All base tokens are inlined or loaded in `tokens.css`.
3. **Lazy-Loaded Theme Assets**: Non-default themes (`apple`, `aws`, `netflix`, `minecraft`) load their scoped CSS and assets on-demand when activated.
4. **Strict Accessibility**: Every theme must satisfy WCAG 2.1 AA color contrast (minimum 4.5:1 for normal text, 3:1 for large text), maintain visible focus rings, support full keyboard navigation, and honor `prefers-reduced-motion`.
5. **No Invented Facts**: All project descriptions, metrics, and highlights must reflect verified facts from `resume.html`. Any missing benchmark has a visible `TODO(verify)` marker.

---

## Design Token Structure (`tokens.css`)

Tokens are declared on `:root` and overridden via `[data-theme="<theme-id>"]`:

```css
:root {
  /* Colors */
  --color-bg: #090d13;
  --color-surface: #0f1722;
  --color-surface-hover: #152233;
  --color-border: rgba(255, 255, 255, 0.08);
  --color-text: #e8edf3;
  --color-text-muted: #94a3b8;
  --color-accent: #38bdf8;
  --color-accent2: #818cf8;

  /* Typography */
  --font-sans: 'Syne', system-ui, sans-serif;
  --font-mono: 'Space Mono', monospace;
  --font-size-hero: clamp(2rem, 5.5vw, 3.8rem);

  /* Radius, Spacing, Shadow, Motion, Blur */
  --radius-md: 10px;
  --radius-pill: 9999px;
  --backdrop-blur: blur(20px);
  --transition-normal: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  --focus-ring: 0 0 0 3px rgba(56, 189, 248, 0.55);
}
```

---

## How to Add a New Theme in 3 Steps

### Step 1: Create the Theme Stylesheet
Create `public/css/themes/<theme-name>.css`:

```css
/* Scoped strictly to [data-theme="<theme-name>"] */
[data-theme="mytheme"] {
  --color-bg: #121214;
  --color-surface: #1e1e24;
  --color-border: rgba(255, 255, 255, 0.12);
  --color-text: #f0f2f5;
  --color-text-muted: #a0a6b5;
  --color-accent: #7c3aed;
  --color-accent-glow: rgba(124, 58, 237, 0.35);
  --radius-md: 14px;
}

/* Optional Component Overrides */
[data-theme="mytheme"] .project-card {
  border-radius: var(--radius-md);
  background: var(--color-surface);
}
```

### Step 2: Register in `public/js/theme-registry.js`
Add the theme definition to the `THEMES` array:

```javascript
{
  id: 'mytheme',
  label: 'My Custom Theme',
  category: 'Design Systems',
  badge: 'Custom Aesthetic',
  description: 'Deep violet aesthetic with high-contrast token overrides.',
  swatch: {
    bg: '#121214',
    surface: '#1e1e24',
    accent: '#7c3aed',
    border: '#7c3aed'
  },
  cssPath: '/css/themes/mytheme.css' // Loaded lazily on selection
}
```

### Step 3: Verify Accessibility & Performance
1. Check contrast with browser DevTools / Lighthouse.
2. Verify keyboard navigation across the theme switcher (`ArrowUp`, `ArrowDown`, `Enter`, `Escape`).
3. Verify URL sharing works: `http://localhost:3000/?theme=mytheme`.
