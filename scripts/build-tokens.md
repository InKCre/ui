# `build-tokens.mjs` Doc

Transforms design tokens from JSON (follows W3C DTCG) to SCSS format.

## Input

- Default: inkcre.tokens.json
- Optional: Custom path via command line argument

## Output

For packages/web:

- src/style/tokens/_ref.scss: Reference/primitive tokens
  - color (from `ref.color`)
  - space (from `ref.space`)
  - radius (from `ref.radius`)
  - size (from `ref.size`)
  - typo (from `ref.typo`)
  - font (from `typography`)
  - breakpoint (from `ref.breakpoint`)
  - elevation (from `effect.elevation`)
  - all: aggregate all the above categories.

- src/style/tokens/_sys.scss: System tokens
  - color-light (from sys.light.color)
  - color-dark (from sys.dark.color)
  - base: aggregate tokens other than color

- src/style/tokens/_comp.scss: Component tokens, from `comp`
  - <comp-name> (from `comp.<comp-name>`)
  - all: aggregate all components tokens

## Transforms

- attribute/kebab-path: Converts token paths to kebab-case
- color/hex-no-alpha: Removes alpha channel from hex colors
- size/px: Adds px unit to dimension tokens (except `opacity`)

## Token naming

- camelCase converted to kebab-case
- Special characters replaced with hyphens
- All paths normalized to lowercase

## Usage

- `npm run build-tokens`
- or `node scripts/build-tokens.mjs [custom-tokens.json]`

## Development

Based on Style Dictionary, read [API reference here](https://styledictionary.com/reference/api/)
