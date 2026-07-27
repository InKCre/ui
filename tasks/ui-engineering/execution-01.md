# Execution 01 — Reproducible Engineering Baseline

Execution 01 was explicitly authorized by Sir on 2026-07-27. This record describes the bounded implementation slice; it is not a publish, consumer mutation, or GitHub-governance change.

## Delivered

- Initially pinned Node `22.22.3` and pnpm `11.17.0` through `.node-version`, `engines`, and `packageManager`; Execution 02 later moved Node authority to pnpm's locked runtime.
- Added an explicit pnpm 11 build-script allowlist for `@parcel/watcher` and `esbuild`, the native tooling required by Sass, Vite, and TSX.
- Removed the package-local lockfile; the root `pnpm-lock.yaml` is the only dependency graph.
- Added root `dev`, `build`, `type-check`, `test`, `story`, `format`, `lint`, generator, and `check` commands.
- Introduced a bounded formatting baseline for shared engineering entrypoints and blocking-error linting without rewriting the legacy component tree.
- Added a generated-output freshness check that snapshots outputs, runs both generators, and fails only if generation changes them. It does not require a clean Git worktree.
- Made Vue source checking explicit and made vite-plugin-dts diagnostics fail package/locales builds.
- Resolved `InkPicker`'s pnpm-linked Vue declaration inference while bundling the internal shared type so rolled declarations expose only portable `vue` imports.
- Refreshed stale generated Agent Skills.
- Replaced weak `InkDialog` tests with public DOM/interaction assertions.
- Fixed and covered uncontrolled `InkImage` expansion, controlled-model behavior, close forwarding, Escape handling, and Scrim close-button propagation.
- Added a patch changeset for the public image/scrim fixes.
- Added a read-only, SHA-pinned pull-request workflow with frozen installation and the canonical root check.
- Updated the release workflow to use the same pinned runtime, frozen installation, and root check before its existing release path.
- Replaced stale root development documentation with the actual toolchain and root commands.

## Verification

| Gate | Result |
|---|---|
| `pnpm format:check` | pass for the bounded engineering baseline |
| `pnpm lint` | pass for blocking Oxlint diagnostics |
| `pnpm check:generated` | pass; tokens and Agent Skills unchanged by regeneration |
| `pnpm type-check` | pass for root scripts and Vue source |
| `pnpm test` | pass; 11 files / 103 tests |
| `pnpm build` | pass; declaration diagnostics are fatal |
| declaration portability scan | pass; no `.pnpm`, relative `node_modules`, or `@vue/shared` import |
| `pnpm story` | pass; 21 stories / 108 variants |
| `pnpm check` | pass in the working tree |
| disposable copy: pnpm `11.17.0` frozen install + `pnpm check` | pass |
| `pnpm changeset status` | patch bump for `@inkcre/web-design` |
| `git diff --check` | pass |

## Known Warnings And Deferred Boundaries

- The committed npm credential placeholder still produces pnpm's untrusted-project-config warning. This is intentionally owned by Execution 02.
- Vite/Histoire still warn about the invalid bare `uno` export; the packed package remains unusable until Execution 03 fixes all exports and missing targets.
- Style Dictionary reports token collisions even though output is stable. Classification belongs with the generator contract in Execution 03.
- API Extractor uses bundled TypeScript 5.8 while the workspace uses 5.9; output is currently portable, but the tooling warning should be removed during the package-contract pass.
- Histoire alpha emits setup-export warnings while still producing the complete catalog. Story runtime/tooling modernization belongs to Execution 04.
- The new workflow has not run on GitHub because no push was authorized. Local and disposable-copy execution prove the command graph, not remote governance.
