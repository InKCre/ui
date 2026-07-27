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
import { createApp } from 'vue'
import InKCreUIWeb from '@inkcre/ui-web'  // optional
import "@inkcre/ui-web/styles" // must

const app = createApp(App)
app.use(InKCreUIWeb)
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

InkHeader and some other components can integrate with your router. See `agent-skills/router/SKILL.md` for setup instructions.

### Use internationalization (i18n)

The design system supports internationalization. See `agent-skills/i18n/SKILL.md` for setup instructions with vue-i18n.

## Features

- Design tokens automatically generated from the main tokens file
- CSS custom properties for theming (light/dark mode support)
- Component-scoped design tokens
- Modular SCSS architecture
- Provider-agnostic router support
- Provider-agnostic internationalization support
- Agent Skills for AI-assisted development

## Agent Skills

The package includes [Agent Skills](https://agentskills.io) - standardized packages of domain expertise that AI agents can discover and load dynamically. Located in `agent-skills/`, component skills are automatically generated from source code during the build process.

Skills work with Claude Code, GitHub Copilot, and other AI agents supporting the agentskills.io standard.
