# Execution 08A — Web DX And Native TypeScript

Execution 08A is planned but has not been authorized. It follows the
registry-backed consumer migration and remote identity closure, so improving
the producer toolchain cannot move or obscure the exact package boundary used
to complete the `design` to `ui` migration.

## Why This Slice Exists

- Oxlint `1.75.0` and Oxfmt `0.60.0` are installed at the workspace root, but
  `packages/web` has no package-local lint, format, or fix commands and no
  package-specific configuration.
- The root formatting command does not cover `packages/web/src`, so the
  component source and Vue SFCs do not currently share the checked formatting
  contract applied to stories and configuration.
- TypeScript `7.0.2` is native, but its programmatic API is not a drop-in
  replacement for the classic API consumed by `vue-tsc`, Volar, `tsx`, and
  declaration tooling.
- `typescript-native-bridge` keeps the classic TypeScript host/API while using
  the TypeScript 7 checker. It is a third-party compatibility boundary and must
  be pinned exactly, verified on every supported CI platform, and removable in
  one dependency/lockfile revert.
- A fresh disposable checkout exposed an existing self-hosting defect:
  CodeMirror and VS Code language-service peers imported by source were
  available in the long-lived workspace but not declared as web-package
  development dependencies. TypeScript 7 also correctly exposed missing
  ambient declarations for Sass and `virtual:uno.css`.

## Ownership Model

- `packages/web` owns the commands and configuration that developers invoke
  while editing Vue, TypeScript, stories, tests, and styles.
- The workspace root owns TypeScript resolution because all tools importing
  the `typescript` package must see one compatible host. A leaf-only override
  would create a mixed compiler graph.
- Root commands remain the canonical CI orchestration surface and delegate the
  web-specific work to the leaf package.
- Oxlint remains a syntax/correctness linter. `vue-tsc` remains the
  authoritative Vue semantic and declaration checker.

## Planned Work

1. Add package-local `format`, `format:check`, `lint`, and `lint:fix` commands
   and focused Oxfmt/Oxlint configuration for source, Vue SFCs, stories,
   tests, styles, and package configuration.
2. Enable the built-in Vue and Vitest Oxlint plugins, remove `--quiet`, and
   clean the existing warning baseline so CI can reject new warnings.
   `lint:fix` uses safe fixes only; dangerous suggestions remain explicit.
3. Keep type-aware Oxlint out of the required gate. The current implementation
   cannot replace Volar's `.vue` virtual-file graph and duplicated type
   diagnostics would add cost without authoritative coverage.
4. Declare every peer imported while developing/building the package as a
   matching dev dependency, while retaining the peer dependency as the
   consumer contract.
5. Add the ambient Vite/style/Uno declarations needed by the native checker
   and remove TypeScript options that no longer exist in TypeScript 7 when
   they have no remaining semantic purpose.
6. Upgrade `vue-tsc` to the proven current compatible release.
7. Pin one exact `typescript-native-bridge` build and apply the pnpm 11
   TypeScript override at the workspace root. Record both its classic host
   version and embedded `tsgo` version; never use `latest` or a range.
8. Capture the stock compiler diagnostics and declaration/package outputs
   immediately before cutover, then make the bridge-backed checker canonical
   only after parity. Do not retain a permanent dual compiler lane.
9. Replace the Prettier editor recommendation with the official Oxc extension
   and provide project-scoped Oxc plus workspace-TypeScript settings without
   storing a machine path.
10. Keep the existing root `pnpm check` and frozen CI entrypoint; add no
    separate doctor or wrapper whose only job is to restate native failures.

## Preflight Evidence

The 2026-07-27 disposable macOS arm64 probe used
`typescript-native-bridge@6.0.3-bridge.7.tsgo.7.0.2` and `vue-tsc@3.3.8`.
The first run failed on undeclared source-development peers and missing
non-TypeScript module declarations. After adding those explicit prerequisites:

- root `tsc` and package `vue-tsc` both loaded the bridge;
- the complete root/package type check passed;
- the web build, declaration rollup, subpath declarations, finalization, and
  generated-skill build passed.

This proves feasibility on one platform, not permission to adopt the exact
versions or proof of Linux CI parity.

## Exit Proof

- A disposable clean checkout passes `pnpm install --frozen-lockfile`,
  package-local format/lint/type-check commands, and the canonical root check.
- The checked formatter covers `packages/web/src`, including Vue and SCSS.
- Oxlint surfaces Vue/Vitest diagnostics and rejects new warnings without
  enabling its incomplete Vue type-check path.
- The bridge activation is observable in root `tsc`, `vue-tsc`, Vite
  declaration generation, and subpath declaration generation.
- Native-checker diagnostics and the packed declaration contract are reviewed
  against the pre-cutover stock baseline.
- macOS arm64 local verification and Ubuntu glibc CI are green. Alpine/musl is
  not claimed as a supported bridge platform.
- Removing the workspace TypeScript override and restoring the prior
  dependency/lockfile slice is sufficient rollback; no source fork or
  compatibility wrapper is required.

## Primary References

- [Oxlint](https://oxc.rs/docs/guide/usage/linter.html)
- [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html)
- [TypeScript 7 native implementation](https://github.com/microsoft/typescript-go)
- [typescript-native-bridge](https://github.com/johnsoncodehk/typescript-native-bridge)
- [Vue language tools](https://github.com/vuejs/language-tools)
