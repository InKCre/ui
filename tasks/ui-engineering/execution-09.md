# Execution 09 — Opt-In Local UI Source Loop

Execution 09 is implemented and locally verified across this producer and
`../client-web`. Sir authorized the slice on 2026-07-28 after
`@inkcre/ui-web@1.3.0` was published and its installed-package contract was
proven. The bounded producer and consumer changes are committed locally and
remain unpushed.

## Outcome

The normal consumer lane remains an exact registry dependency. A developer can
now opt one process into the sibling UI source graph without linking packages,
editing a manifest, changing the workspace, or writing a machine path:

```bash
pnpm dev:ui --ui-source ../ui/packages/web
pnpm type-check:ui --ui-source ../ui/packages/web
```

`../client-web` owns the overlay because its Vite, Vitest, TypeScript, Sass,
Module Federation, SVC, and Portless pipelines compile and serve the external
source. This producer owns package-source compatibility, generated inputs, its
package README, and the Changeset.

## Consumer Contract

The tracked consumer helper validates the real package root before returning
any configuration:

- `package.json` must name `@inkcre/ui-web`;
- all ten public source entries must exist: root, styles, functions, mixins,
  ref/sys/comp tokens, utilities, locales, and UnoCSS;
- the global component declaration must exist;
- environment-based configuration must be an absolute path;
- build mode rejects the source overlay.

The resulting aliases are exact regular expressions, so an undeclared private
subpath cannot silently become public. Source mode extends Vite's filesystem
allowlist with both the detected client workspace and the validated package
root. No absolute path is stored in Vite configuration.

Vue and other shared peers are deduplicated to the consumer installation. The
UI package is excluded from dependency pre-bundling in source mode. The same
contract is used by the client Vite server, client Vitest project, and Twitter
remote.

## Sass Ownership

The previous substring test for `src/components/` could classify a sibling UI
component as client source and inject client-only `@/styles`. Source mode uses
real path containment instead:

- client components, views, and host extensions receive UI functions/mixins
  plus client styles;
- sibling UI components receive only UI functions/mixins;
- unrelated files receive no injected prelude.

This keeps `@/` consumer-owned while allowing UI component Sass to compile and
hot-reload inside the host graph.

## Lifecycle And Identity

The root `dev:ui` launcher:

1. accepts `--ui-source` or `INKCRE_UI_SOURCE_ROOT`, never both;
2. resolves and validates the source package;
3. prints one `NON-RELEASE` banner with its version and real root;
4. asks SVC to ensure the separate worktree-scoped `web-ui` capability;
5. lets the Vite identity endpoint and SVC probe compare a non-path source
   identity hash, preventing a route for a different checkout from being
   reused silently.

`dev:all:ui` carries the same environment into extension development.
`dev:stop` knows the additional Portless route. The established database
capability remains shared with normal client development.

## Type Graph

`type-check:ui` writes a temporary tsconfig below ignored
`.runtime/ui-source/`, maps the same exact source entries, maps peer packages
to the consumer installation, includes the UI global component declaration,
runs Vue TSC, and removes the directory.

The strict cross-repository graph exposed two producer compatibility defects:

- type-only public exports were emitted as value exports;
- JSON language-service versions disagree on whether a diagnostic message is
  always a string or may be markup content.

The producer now uses type-only exports and normalizes an unknown diagnostic
message into a CodeMirror string. Both the producer's pinned graph and the
consumer source graph pass.

## Durable Consumer Documentation

The complete operating guide lives in
`../client-web/apps/client-web/docs/development.md`. It covers prerequisites,
the recommended checkout shape, environment-variable use, remote development,
source type checking, generated tokens, cleanup, Portless behavior, and the
release-fidelity boundary.

Short routes to that guide are present in the consumer root README, docs
index, app `AGENTS.md`, extension guide, architecture, and filesystem map. This
producer links to it from both the repository README and the published
package-local README, so a consumer inspecting the repository or installed
package can find the canonical instructions.

## Local Proof

- `pnpm exec vitest run scripts/ui-source.test.mjs`: 5 contract tests pass.
- `pnpm type-check:ui --ui-source <real-package-root>` passes and removes its
  temporary config.
- Source-mode client Vitest passes 3 files / 19 tests.
- Vite-transformed client and Twitter modules import the sibling UI source
  rather than `node_modules`.
- WebSocket observation proves both a Vue template edit and an SCSS edit under
  the sibling package emit HMR updates for the external source path.
- UI-owned Sass compiles in both the client and Twitter source graphs.
- A source-enabled production build fails with the intentional
  development-only error.
- Source SVC startup reports a healthy `web-ui` capability and a distinct
  `client-web-ui-<instance>` route.
- SHA-256 values for the consumer root manifest, client manifest, Twitter
  manifest, and lockfile are byte-identical before startup and after route
  shutdown.
- The complete consumer check passes 11 test files / 40 tests and all builds.
- The complete producer check passes 12 test files / 104 tests, both packed
  contracts, and 21 stories / 108 variants.

The initial consumer run warned that the interactive shell used Node `26.3.0`
while the repository declared Node `22.22.3`. Sir chose organization
consistency rather than a Node 26 adoption. The consumer now matches this
producer's pnpm-managed `devEngines.runtime`: `pnpm exec node` and the
repository doctor report exact Node `22.22.3` independently of system Node,
and setup-node reads the same package authority. Frozen installation, the
complete consumer check, source-mode tests, and the source type graph pass
after the migration.

## Rollback

The consumer overlay is isolated to the new helper, launch/type-check scripts,
three Vite-family configurations, one SVC target, and documentation. Removing
that slice restores the exact registry-only graph. No dependency, lockfile,
workspace, or persisted local-link state must be repaired.
