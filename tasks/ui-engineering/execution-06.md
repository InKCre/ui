# Execution 06 — Registry-Backed Consumer Migration

Sir explicitly started Execution 06 on 2026-07-27. It was committed, pushed,
and remotely verified on 2026-07-28. This slice migrates every known
`../client-web` consumer from the frozen old package to the already published
exact `@inkcre/ui-web@1.2.2` artifact. It did not introduce a source overlay or
change the producer toolchain or skill delivery.

## Baseline And Scope

- The bounded consumer baseline is `../client-web` revision
  `71a64fd2fe1994aab659e9ccafbbe1b79bab48c5`.
- The three package importers are `apps/client-web`,
  `packages/ext-dev-utils`, and `extensions/twitter`.
- `apps/client-webext` does not consume the UI package.
- Historical old-name evidence under `../client-web/tasks/**` remains
  unchanged; active code, configuration, instructions, templates, and
  documentation own the migration.

## Delivered

- Pinned all three importer manifests to exact `@inkcre/ui-web@1.2.2`.
- Regenerated the lockfile from GitHub Packages. Its package URL and
  `sha512-26u+VHciYNpPN9BHwwMoqqPWPN56JsNoa1n5ZkfY7aE5Rq/UwUuVgrWpY1tfzRBo9ec+Fvu1IT4lBj8xLhs9ug==`
  integrity match the Execution 05 publication evidence.
- Added the package's required
  `vscode-languageserver-textdocument@^1.0.12` peer explicitly to the web app;
  the lock also resolves the optional UnoCSS peer.
- Migrated Vue/TypeScript imports, global types, CSS and Sass subpaths, the
  Vitest mock, web and Twitter Sass injection, developer instructions, and the
  extension Vite template.
- Deleted the four Vitest aliases that bypassed the old package's invalid
  exports through direct `node_modules`, `dist`, and Sass paths. The migrated
  app now proves the public package exports instead of retaining renamed
  workarounds.
- Added a release-age exception for only `@inkcre/ui-web@1.2.2`. The repository
  records pnpm 11's built-in 24-hour gate, and this exact internally published
  migration artifact was intentionally consumed on its publication day; the
  broader supply-chain policy remains active.
- Active non-historical `@inkcre/web-design` references are zero.

## Registry And Authentication Proof

- A direct unauthenticated lookup returned HTTP 401, confirming that
  repository configuration does not own a credential.
- The first install attempt inherited a stale `NODE_AUTH_TOKEN` and was
  rejected without exposing the credential.
- A second attempt used the active GitHub CLI credential through a temporary
  trusted user npmrc outside both repositories. It downloaded the new tarball
  and regenerated the lock; the temporary file was then deleted.
- With Node `22.22.3`, pnpm `11.11.0`, the trusted temporary auth boundary, and
  the regenerated lock candidate, `pnpm install --frozen-lockfile` passed
  including the existing WXT postinstall.
- The installed graph contains one UI version, `1.2.2`, for all three
  importers. A direct ESM smoke observed 21 `Ink*` exports, version `1.2.2`,
  and the Vue plugin install function.

No token, token placeholder, or machine-specific path was written to either
repository.

## Verification

| Gate                                          | Result                   |
| --------------------------------------------- | ------------------------ |
| exact registry resolution and integrity       | pass                     |
| `pnpm install --frozen-lockfile`              | pass                     |
| active old-name and direct-alias search       | zero                     |
| package-local and workspace TypeScript checks | pass                     |
| client-web Vitest                             | 10 files / 35 tests pass |
| client-web production build                   | pass                     |
| ext-dev-utils type check                      | pass                     |
| Twitter remote type check and build           | pass                     |
| Chromium web extension type check and build   | pass                     |
| root `pnpm check`                             | pass                     |
| type-aware Oxlint shadow lane                 | pass                     |
| native TypeScript 7 shadow lane               | pass                     |
| `git diff --check`                            | pass                     |
| pre-rename complete Client checks             | pass                     |
| post-rename complete Client checks rerun      | pass                     |

The root build proves the new JavaScript, declaration, CSS, Sass, token, and
global-component surfaces through the normal Vite/Vitest resolvers with no UI
filesystem alias.

A supplemental `pnpm peers check` still reports three unrelated ecosystem
mismatches involving Rspack Module Federation, `zod-class`, and the Vite 8
plugin graph. It reports no missing `@inkcre/ui-web` peer, and the canonical
type, test, and build gates are green; those diagnostics remain outside this
identity-only slice.

## Rollback And Deferred Work

- The consumer migration is committed as
  `b08cade2e1b527dc5720e8e84de7b3c703cca8d6`. Reverting that bounded commit
  restores the three old manifest entries, lock, imports, and aliases.
- `@inkcre/web-design@1.2.2` remains installable and is not yet deprecated.
- The remote repository rename is recorded in Execution 07; only the local
  checkout directory rename remains deferred.
- Web DX/native TypeScript and Intent delivery remain Executions 08A and 08B.
- The optional source overlay remains Execution 09.
