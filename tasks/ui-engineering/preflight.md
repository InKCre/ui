# UI Engineering Implementation Preflight

This file records the 2026-07-27 implementation rehearsal and volatile evidence behind [`packet.md`](packet.md) and [`roadmap.md`](roadmap.md). It is not implementation authorization.

## Verdict

The migration is feasible, but a rename-first execution would carry existing failures into a new repository and package identity. The safe order is:

```text
reproducible baseline
-> auth authority
-> packed package contract
-> story/behavior baseline
-> new identity and exact-version publication
-> registry-backed consumer migration
-> optional source loop
-> remote rename and external integration smoke
```

The source loop deliberately follows the registry migration. That makes it an optimization of a known-good package relationship instead of a way to conceal missing exports, declarations, or registry access.

## Isolated Baseline

The QA run used `git archive` at `c97259c6480a7cc152f1d13489b3fd14d7678b7f` in a disposable directory. It did not read untracked task files into the snapshot or write implementation changes into the workspace.

| Probe | Result | Meaning |
|---|---|---|
| Node `v22.22.3`, project-selected pnpm `10.25.0` | observed during the initial probe | The repository's old `packageManager` field masked the linked Homebrew pnpm `11.17.0`; Execution 01 now pins the confirmed Homebrew version. |
| `pnpm install --frozen-lockfile` | pass | Root lock reproduces the snapshot, but pnpm warns that the committed token placeholder is untrusted and that selected dependency build scripts are ignored. |
| `pnpm build-tokens` twice | pass; byte-stable | Token generation itself is deterministic in the tested root invocation. Style Dictionary reports token-collision warnings that should be classified, not silently normalized. |
| `pnpm build-skills` twice | stable second run; dirty against HEAD | Generated component skill index plus `InkImage` and `InkScrim` references are stale in the repository. |
| web package build | exit 0 | Not a clean signal: Vite warns about the invalid mixed exports map and declaration generation reports TS2742 for `inkPicker` without failing. |
| Vitest | fail; 11/116 tests | Three `InkDialog` assertions target stale VM names; eight `InkImage` failures expose an optional-model behavior defect rather than test-only drift. |
| Histoire build | pass; 21 stories / 108 variants | The catalog is buildable, with the same exports/declaration warnings; this does not replace behavior or package-contract proof. |
| npm/pnpm pack | pass; identical 40-file paths | The allowlist is bounded, but the extracted artifact is not consumable: every Node entry fails with `ERR_INVALID_PACKAGE_CONFIG`, `./utils` has no target, and the `./locales` declaration target is absent. |
| `pnpm changeset status` | inconclusive in archive | The command requires Git ancestry that a `git archive` intentionally omits; this result is an environment limit, not evidence of broken Changesets configuration. |

## GitHub And Registry Boundary

All checks were read-only.

| Surface | Confirmed state | Precondition before mutation |
|---|---|---|
| `InKCre/design` | public, active, default branch `main`; current identity has admin access | none for local baseline |
| `InKCre/ui` | API 404, absent from visible org listing/search | confirm rename acceptance immediately before the remote operation |
| `@inkcre/web-design` | GitHub npm package is private, associated with `InKCre/design`, latest `1.2.2` | reconcile actual private visibility with root `publishConfig.access=public` |
| `@inkcre/ui-web` | absent from visible org packages and registry | confirm canonical name, visibility, repository association, and first-publish permissions |
| `client-web` package access | latest main CI succeeds with `packages: read`; lock resolves `1.2.2` | grant and prove access to the new package; existing success is not proof of a future ACL |
| Actions authority | repository default is `write`; release inherits broad defaults | use explicit job permissions, then lower the default to `read` after CI exists |
| `main` governance | active ruleset blocks deletion/non-fast-forward only; no required status check | add the canonical PR check as a separate governance mutation after it is green |
| Figma dispatch | receiver and 11 historical runs are visible; external sender is not | identify the sender/owner before remote rename; use live dispatch only as post-deploy smoke |
| webhooks | no repository hooks; organization hooks are not visible with current scope | do not infer that no organization-level integration exists |

## Consumer Blast Radius

The current `../client-web` snapshot contains:

- three package manifests with the old dependency;
- 44 files, 62 matching lines, and 66 occurrences of `@inkcre/web-design` including historical task records;
- 40 files, 56 matching lines, and 60 occurrences when `tasks/**` is excluded;
- active package, lock, source, Vite, Vitest, TypeScript, Sass, documentation, extension-utility, and Twitter-remote surfaces.

Migration proof must therefore check the three manifests and lockfile together with key configuration. A single import search or a successful source alias is insufficient.

## Mental Rehearsal And Failure Containment

| Stage | Likely failure if executed naïvely | Planned containment and rollback |
|---|---|---|
| Baseline | Existing tests fail; declaration errors remain warnings; lockfiles diverge; a formatter rewrite obscures behavioral fixes | Freeze current evidence, make type/test failures non-zero, converge the lock first, and stage lint/format adoption without a mass rewrite. |
| Auth | Project config owns a token placeholder; release inherits broad write authority; private-package ACL is assumed | Keep only scope routing in the repository, use trusted user/setup-node auth, bind tokens per step, and prove the new package grant before migration. |
| Package contract | Source build passes while tarball has invalid exports, absent utilities, leaked `.vue` declarations, or bundled peers | Make `npm pack` plus a disposable consumer fixture the producer gate; never substitute a sibling alias. |
| Token workflow | Figma PR updates generated files but omits a changeset, or repeated runs collide on one filename | Generate a workflow-identity-scoped changeset from validated input and test the transformation with a deterministic fixture. |
| Identity/publish | New name is unavailable, first publish gets wrong visibility, or old consumers lose rollback | Check identifiers just-in-time, publish as a new immutable package, install the exact version, retain the old final artifact, and document migration before consumers move. |
| Consumer | Only one manifest changes, lockfile silently repairs, or legacy Vitest aliases mask the new package | Update all three manifests and the lock in one bounded slice, delete workarounds, run a fresh frozen registry install, and rollback by reverting that consumer slice. |
| Source loop | Absolute sibling paths leak into Git; Vite blocks external files; Vue is duplicated; source success masks registry defects | Introduce it only after registry migration, keep the path process-scoped, validate exact entries, preserve Vite's workspace root, dedupe peers, and leave manifests/locks byte-identical. |
| Remote rename | Figma sender still targets `design`; package association or docs point to the old remote; the active tool loses its cwd | Rename last, inventory the external owner first, rely on deterministic workflow proof, run live dispatch afterward, and defer local directory rename to a session boundary. |

## Deliberately Rejected Complexity

- No custom auth doctor until repeated failures demonstrate positive ROI.
- No `link:`, `file:`, nested workspace, local registry, or committed machine path for source development.
- No compatibility framework merely to duplicate static old-name searches, packed-fixture checks, and frozen consumer installation.
- No forwarding old package by default when all known consumers can migrate and immutable old versions already provide rollback.
- No live external dispatch as the sole workflow test.
- No repository-wide formatter rewrite hidden inside the baseline repair.
- No SVC adoption inside the UI migration critical path; open it as a separate task if desired.

## Decision And Authorization Gates

Execution 01 was explicitly started and completed locally on 2026-07-27. Its current evidence is recorded in [`execution-01.md`](execution-01.md).

Before Execution 05:

1. confirm private versus public GitHub Package visibility;
2. accept the recommended freeze/deprecate/no-wrapper old-package policy or request a compatibility package.

Before Execution 08:

1. confirm GitHub accepts the `InKCre/ui` rename;
2. identify the external Figma dispatch owner and update mechanism;
3. explicitly authorize remote, package-association, governance, and local-remote mutations.
