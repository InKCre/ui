# Contributing

The organization-wide Git and pull-request policy lives in
[InKCre Git and GitHub Governance](https://github.com/InKCre/.github/blob/main/GOVERNANCE.md).
This guide covers the `ui`-specific development, delivery, and joint-development workflows
required by that policy.

## Setup

```bash
git submodule update --init --recursive docs/_shared
pnpm install --frozen-lockfile
pnpm generate
```

Install once at the repository root. Do not install from individual package directories;
the root `pnpm-lock.yaml` is the only dependency lock. Dependency lifecycle scripts are
denied by default; the reviewed allowlist lives in `pnpm-workspace.yaml`.

Run all project commands through pnpm. The root `packageManager` field selects pnpm, and
`devEngines.runtime` resolves the exact Node.js runtime into the lockfile.

## Daily commands

```bash
pnpm dev          # Run the web package development server
pnpm story:dev    # Run the interactive component catalog
pnpm type-check   # Check root scripts and Vue source
pnpm generate     # Rebuild tokens, package metadata, and Agent Skills
pnpm build        # Build the publishable package
pnpm story        # Build the component catalog
pnpm check        # Run the complete local/CI baseline
```

`pnpm generate` produces derived files from the public component manifest: the runtime
registry, global component types, package version, Story coverage, and generated Agent
Skills. Token JSON changes always require `pnpm generate` before consumption.

## Testing

This repository has no automated unit/component test suite and no `pnpm test` command.
Run targeted checks for daily changes; use `pnpm check` as the complete local/CI baseline.
For interaction or visual behavior changes, also review the affected Story or real
consuming page — build and coverage checks do not prove those behaviors correct.
Check selection follows the [organization verification policy](https://github.com/InKCre/.github/blob/main/TESTING.md).

## Token pipeline

`tokens/inkcre.tokens.json` is the Token specification source. Figma proposes value
updates against existing paths; the generator owns generated outputs.
See [Token Guide](tokens/tokens.md) for the input format and maintenance entry, and
[Token Build Notes](scripts/build-tokens.md) for generation commands and outputs.

`scripts/build-tokens.ts` uses [Style Dictionary](https://www.npmjs.com/package/style-dictionary)
to produce:

- `packages/web/styles/tokens/_ref.scss`
- `packages/web/styles/tokens/_sys.scss`
- `packages/web/styles/tokens/_comp.scss`
- `packages/web/styles/uno/preset-ink.ts`

## Histoire delivery

The showcase build uses the lockfile-pinned Vue and Histoire highlight implementations,
bundled by Vite. Do not swap Vue for a CDN production build or stub Shiki with an empty
object; Histoire's state sync and source panel depend on these libraries' actual runtime
contracts.

`UI checks` validates Histoire as part of the repository contract. After a successful
same-repository run, the trusted Preview workflow checks out that exact pull-request head,
builds Histoire itself, and publishes to the stable `pr-N.design-dd4.pages.dev` preview
alias. Closing the pull request replaces the alias with a noindex marker; Cloudflare
retains older immutable deployment URLs as platform history.

A protected `main` push builds Histoire again as a focused release, transfers the exact
same-run artifact to the deployment job, and publishes it to
[design.inkcre.dev](https://design.inkcre.dev). Package publication and Histoire delivery
are independent outputs of `main`: one may be retried without republishing the other.
`wrangler.toml` owns the Pages project name, output directory, and compatibility date.
Delivery jobs run through GitHub environments; the Cloudflare credential remains a
selected organization Actions secret.

## Joint development with impl-ts

The consuming Vite/Vitest/TypeScript pipeline owns source consumption. Keep this
workspace installed and generated, then opt in from a sibling `impl-ts` checkout:

```bash
pnpm install --frozen-lockfile
pnpm generate
pnpm --dir ../impl-ts dev:ui --ui-source ../ui/packages/web
```

The command validates this package root and maps only its public specifiers for the
current development process. It does not use `pnpm link`, persist an absolute path, or
modify either manifest or lockfile. Token JSON changes still require `pnpm generate`.

Run the consumer source-graph check with
`pnpm --dir ../impl-ts type-check:ui --ui-source ../ui/packages/web`.
Normal client development, builds, checks, and CI remain pinned to the published
registry artifact. The consumer's
[`docs/40-deployment/development-runtime.md`](https://github.com/InKCre/impl-ts/blob/main/docs/40-deployment/development-runtime.md#joint-development-lanes)
owns the full startup, remotes, cleanup, troubleshooting, and release-fidelity contract.

## Public package delivery

`@inkcre/ui-web` has no confidentiality requirement. GitHub Packages remains the publishing
registry; anonymous consumers use the original package tarball attached to its versioned GitHub
Release. Changing GitHub Package visibility alone does not remove npm authentication.

The release workflow publishes with Changesets, then runs `pnpm release:public <version> --publish`.
The command reads the already-published registry tarball, checks its integrity and package identity,
and attaches those exact bytes to the existing `@inkcre/ui-web@<version>` Release. It does not build,
version, or publish an npm package. An identical attachment is a successful no-op; a conflicting
attachment fails without overwriting it. Anonymous download and byte comparison complete the check.

Maintainers can prepare or recover a single version independently of npm publication:

```bash
pnpm release:public 2.3.0           # Read-only checks; does not upload
pnpm release:public 2.3.0 --publish # Explicit public upload or verification
```

This requires GitHub CLI authentication for release access and npm authentication for package reads;
upload additionally requires repository contents write access. No token is embedded in the download
URL. Run `pnpm check:public-package` for the append-only/retry regression check.

Consumers retain semver dependencies where runtime sharing reads those ranges. After the asset is
published and anonymously verified, a pnpm workspace can route the exact version using a root
`pnpm-workspace.yaml` override:

```yaml
overrides:
  '@inkcre/ui-web@2.3.0': https://github.com/InKCre/ui/releases/download/%40inkcre%2Fui-web%402.3.0/inkcre-ui-web-2.3.0.tgz
```

Regenerate and review the lockfile, then verify a fresh `pnpm install --frozen-lockfile` with an empty
store and no GitHub token, plus consumer builds. Never activate an override before its attachment
exists. The initial 2.3.0 attachment and `impl-ts` consumer cutover are pending release approval;
the current consumer lockfile still requires GitHub Packages access.

## GitHub Packages authentication

The committed `.npmrc` routes only the `@inkcre` scope to GitHub Packages. It never
stores or expands a credential. Local credentials belong to the trusted user
configuration.

For interactive one-time setup, create a classic GitHub personal access token with
`read:packages` and confirm read access to the package, then let npm write it to your user-level
configuration. A token scope does not grant the package ACL:

```bash
npm login --scope=@inkcre --auth-type=legacy --registry=https://npm.pkg.github.com
```

Use your GitHub username, the token as the password, and your public email when
prompted. Alternatively, a credential manager may inject `NODE_AUTH_TOKEN` into the
current process if your user-level `~/.npmrc` contains:

```ini
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Do not add that credential line to the repository `.npmrc`. Verify access with the
package manager itself:

```bash
pnpm view @inkcre/ui-web version
pnpm install --frozen-lockfile
```

Treat `401` or `403` as an expired token, missing `read:packages`, or missing package
access. A `404` can also mean that the package name or repository access is wrong.
Re-run the native login flow after correcting the underlying GitHub permission; this
repository intentionally has no separate auth doctor.

## Shared product docs

Shared InKCre product truth and cross-unit contracts are mounted read-only at
`docs/_shared` from [`InKCre/docs`](https://github.com/InKCre/docs). Initialize the
pinned reference after cloning:

```bash
git submodule update --init --recursive docs/_shared
```

Do not edit the mounted files from this repository. The repo-root
`.agents/skills/edit-svc-shared-docs` wrapper points coding agents to the canonical
Hub-first edit and isolated ref-bump workflow.
