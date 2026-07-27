# InKCre Design

The InKCre design system and web UI library.

## Single Source of Truth

Designers publish tokens from Figma. Keep `tokens/inkcre.tokens.json` as the
authoritative source and edit generated files only through the generators.

`scripts/build-tokens.ts` transforms the token source into:

- `packages/web-design/styles/tokens/_ref.scss`
- `packages/web-design/styles/tokens/_sys.scss`
- `packages/web-design/styles/tokens/_comp.scss`
- `packages/web-design/styles/uno/preset-ink.ts`

The generator uses
[Style Dictionary](https://www.npmjs.com/package/style-dictionary).

## Toolchain

Use the versions pinned by `.node-version` and the root `packageManager` field:

- Node.js `22.22.3`
- pnpm `11.17.0`

Install once at the repository root:

```bash
pnpm install --frozen-lockfile
```

Do not install from an individual package directory. The root
`pnpm-lock.yaml` is the only dependency lock.
Dependency lifecycle scripts are denied by default; the small reviewed
allowlist lives in `pnpm-workspace.yaml`.

## Development commands

```bash
pnpm dev          # Run the web package development server
pnpm story:dev    # Run the interactive component catalog
pnpm test         # Run the unit suite once
pnpm type-check   # Check root scripts and Vue source
pnpm generate     # Rebuild tokens and Agent Skills
pnpm build        # Build the publishable package
pnpm story        # Build the component catalog
pnpm check        # Run the complete local/CI baseline
```

Generate derived files with `pnpm build-tokens` and `pnpm build-skills`.
