---
name: styling
description: Use @inkcre/ui-web styling system with design tokens, SCSS mixins, and theming.
---

# Styling System

Use this skill when working with the @inkcre/ui-web styling system.

## Overview

The design system provides:
- Design tokens (colors, spacing, typography, etc.)
- SCSS mixins and functions
- Theme support (light/dark modes)
- CSS custom properties

## Import SCSS Utilities

```scss
@use "@inkcre/ui-web/styles/mixins" as *;
@use "@inkcre/ui-web/styles/functions" as fn;
@use "@inkcre/ui-web/tokens/ref" as ref;
@use "@inkcre/ui-web/tokens/sys" as sys;
@use "@inkcre/ui-web/tokens/comp" as comp;
```

## Design Tokens

### Token Layers

1. **Reference Tokens** (`ref`): Primitive values
2. **System Tokens** (`sys`): Semantic tokens
3. **Component Tokens** (`comp`): Component-specific tokens

### Token Categories

- **Colors**: `ref.$color`, `sys.$color-light`, `sys.$color-dark`
- **Spacing**: `ref.$space` (xs, sm, md, lg, xl, etc.)
- **Typography**: `ref.$typo` (font sizes, weights, line heights)
- **Border Radius**: `ref.$radius`
- **Elevation**: `ref.$elevation` (shadows)
- **Breakpoints**: `ref.$breakpoint` (sm, md, lg, xl)
- **Opacity**: `ref.$opacity`

## Usage Examples

```scss
.my-component {
  // Use system tokens
  color: fn.map-deep-get(sys.$color-light, "text", "base");
  padding: fn.map-deep-get(ref.$space, "md");
  border-radius: fn.map-deep-get(ref.$radius, "sm");
  
  // Use component tokens
  background: fn.map-deep-get(comp.$light, "button", "bg-primary");
}
```

## Theme Support

```scss
// Light mode
[data-theme="light"] {
  --color-text-base: #{fn.map-deep-get(sys.$color-light, "text", "base")};
}

// Dark mode
[data-theme="dark"] {
  --color-text-base: #{fn.map-deep-get(sys.$color-dark, "text", "base")};
}
```

## UnoCSS Configuration

```typescript
// uno.config.ts
export default defineConfig({
  safelist: [
    'i-mdi-menu',
    'i-mdi-loading',
    'i-mdi-refresh',
    'i-mdi-chevron-right',
    'i-mdi-chevron-down',
    'i-mdi-alert-circle-outline',
    'i-mdi-inbox-outline',
    'animate-spin'
  ]
})
```
