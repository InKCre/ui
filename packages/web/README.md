# @inkcre/ui-web

A comprehensive design system built with Vite + Vue3, providing design tokens, components, and utilities for InKCre web applications.

## Installation

```bash
npm install @inkcre/ui-web
# or
pnpm add @inkcre/ui-web
```

## Usage

```typescript
// main.ts
import { createApp } from "vue";
import InKCreUIWeb from "@inkcre/ui-web"; // optional
import "@inkcre/ui-web/styles"; // required once

const app = createApp(App);
app.use(InKCreUIWeb);
```

```scss
// Your component styles
@use "@inkcre/ui-web/styles/mixins" as *;
@use "@inkcre/ui-web/styles/functions" as *;
```

```json
// tsconfig.json
{
    "compilerOptions": {
        "types": [
            ...,
            "@inkcre/ui-web"  // add this
        ]
    }
}
```

```ts
// uno.config.ts
export default defineConfig({
    ...,
    safelist: [
        'i-mdi-menu',
        'i-mdi-loading',
        i-mdi-refresh,
        'i-mdi-chevron-right',
        'i-mdi-chevron-down',
        'i-mdi-alert-circle-outline',
        'i-mdi-inbox-outline',
        'animate-spin'
    ]
})
```

### Use routing

InkHeader and other components can consume a router adapter. Load
`@inkcre/ui-web#ui-web` through TanStack Intent and read
`references/integration.md` for the package boundary.

### Use internationalization (i18n)

The design system supports internationalization through the same adapter
boundary. The installed UI skill documents the provider contract and locale
subpath.

## Features

- Design tokens automatically generated from the main tokens file
- CSS custom properties for theming (light/dark mode support)
- Component-scoped design tokens
- Modular SCSS architecture
- Provider-agnostic router support
- Provider-agnostic internationalization support
- Agent Skills for AI-assisted development

## Agent Skills

The package ships one progressively disclosed Agent Skill under
`skills/ui-web`. Consumers explicitly trust the package through
`package.json#intent.skills`, then discover and load it with the pinned
[TanStack Intent](https://tanstack.com/intent) CLI:

```json
{
  "intent": {
    "skills": ["@inkcre/ui-web"]
  }
}
```

```bash
intent list
intent load @inkcre/ui-web#ui-web
```

The generated component facts come from the public component manifest and
source/story contracts. Selection and composition guidance is reviewed in
`skill.seed.json`.
