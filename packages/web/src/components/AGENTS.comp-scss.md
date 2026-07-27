# `compName.scss` guide

## Best Practices

- Use UnoCSS for simple styles (e.g. layout)
- Make use of morden CSS features:
  - Parent selectors (eg. `.card:has(input:checked)`)
  - `@starting-style` and `transition-behavior: allow-discrete`

### Use Design Tokens

Use design tokens by (auto injected, no import needed):

- using function `sys-var($path...)` for simple tokens (e.g. `background-color: sys-var(color, surface, base)`).
- using mixins `apply-font($size)`, `apply-icon($size, $centered: false)`, `apply-elevation($level)` for composite tokens.

Read token list [here](/tokens/tokens.md)

Never use reference tokens directly.

### Naming

- Name selectors with BEM.
  - Make use of SCSS features like nesting, `&` and etc.
  - When there's more than 2 layer of elements, start a new block.

## Use icons

- You can use icon by adding class `i-mdi-<icon-name>`. (add to README.md uno.config.ts safelist)
- Configure icon size and layout using `pu-icon` mixin.
