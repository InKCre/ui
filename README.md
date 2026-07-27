# InKCre UI

The InKCre design system and multi-platform UI workspace. The current web
renderer is published as `@inkcre/ui-web`.

## Single Source of Truth

Designers publish tokens from Figma. Keep `tokens/inkcre.tokens.json` as the
authoritative source and edit generated files only through the generators.

`scripts/build-tokens.ts` transforms the token source into:

- `packages/web/styles/tokens/_ref.scss`
- `packages/web/styles/tokens/_sys.scss`
- `packages/web/styles/tokens/_comp.scss`
- `packages/web/styles/uno/preset-ink.ts`

The generator uses
[Style Dictionary](https://www.npmjs.com/package/style-dictionary).

## Toolchain

The root manifest delegates both tools to pnpm:

- pnpm `11.17.0`
- Node.js runtime `22.22.3`

The root `packageManager` selects pnpm. Its `devEngines.runtime` entry makes
pnpm resolve the exact Node.js runtime into the lockfile and use it for project
scripts. Run project commands through pnpm rather than a separately managed
Node installation.

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

Generate derived files with `pnpm generate`. The public component manifest
drives the runtime registry, global component types, package version, Story
coverage, and generated Agent Skills.

## GitHub Packages authentication

The committed `.npmrc` routes only the `@inkcre` scope to GitHub Packages. It
never stores or expands a credential. Local credentials belong to the trusted
user configuration.

For interactive one-time setup, create a classic GitHub personal access token
with `read:packages`, then let npm write it to your user-level configuration:

```bash
npm login --scope=@inkcre --auth-type=legacy --registry=https://npm.pkg.github.com
```

Use your GitHub username, the token as the password, and your public email when
prompted. Alternatively, a credential manager may inject `NODE_AUTH_TOKEN`
into the current process if your user-level `~/.npmrc` contains:

```ini
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Do not add that credential line to the repository `.npmrc`. Verify access with
the package manager itself:

```bash
pnpm view @inkcre/ui-web version
pnpm install --frozen-lockfile
```

Treat `401` or `403` as an expired token, missing `read:packages`, or missing
package access. A `404` can also mean that the package name or repository
access is wrong. Re-run the native login flow after correcting the underlying
GitHub permission; this repository intentionally has no separate auth doctor.
