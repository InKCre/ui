# Execution 07 — Remote Rename And Identity Closure

## Status

Execution 07 is in progress. The GitHub repository was renamed from
`InKCre/design` to `InKCre/ui` on 2026-07-28 after the registry-backed
Execution 06 consumer run passed. The repository, package association, local
remote, fresh-clone path, release workflow, post-rename consumer package
access, and Cloudflare Pages build are proven. The release-PR version
generator, required status-check governance, a live Figma dispatch, and the
local checkout directory remain explicit closure items.

## Applied Identity Mutation

| Surface | Result |
| --- | --- |
| GitHub repository | `InKCre/ui` |
| Stable repository ID | `R_kgDOQbKaGg` before and after rename |
| Default branch / visibility | `main` / public |
| Old web URL | HTTP 301 to `https://github.com/InKCre/ui` |
| Old Git URL | still resolves `main` through GitHub's rename redirect |
| Local `origin` | `ssh://git@github.com/InKCre/ui` |
| Repository description | `InKCre design system and UI libraries` |
| Homepage | cleared because the old Storybook hostname does not resolve |
| GitHub Package source | private `@inkcre/ui-web`, package ID `14055172`, associated with `InKCre/ui` |
| Default Actions authority | `read`; workflow-token PR approval disabled |

The local checkout directory remains
`/Volumes/WorkSSD/Development/InKCre/design`. Renaming that directory while the
current tool owns it would invalidate the active workspace, so it is deferred
to a user/session boundary.

## Remote Proof

1. `../client-web` commit `b08cade` was pushed to `main`.
2. Client checks run
   [`30320257162`](https://github.com/InKCre/client-web/actions/runs/30320257162)
   passed before the producer rename.
3. The same run was rerun after the producer rename. All four executable jobs
   passed again, including frozen private-package installation, workspace
   contracts, native TypeScript 7 shadow checking, Chromium/Firefox extension
   contracts, and the isolated browser/database chain. This proves that the
   `InKCre/client-web` Actions Read grant survived the package's source
   association change to `InKCre/ui`.
4. Producer commits through `1d4ab92` were pushed to the renamed repository.
   Release run
   [`30320502078`](https://github.com/InKCre/ui/actions/runs/30320502078)
   passed checkout, frozen installation, the full root check, and Changesets
   execution under the new repository identity.
5. A new shallow clone from `ssh://git@github.com/InKCre/ui` passed frozen
   installation and the full root check on pnpm `11.17.0` and Node `22.22.3`:
   12 test files / 104 tests, package build and packed contracts, and 21 stories
   / 108 variants.

## Release-PR Defect And Bounded Fix

Changesets created release PR
[`#31`](https://github.com/InKCre/ui/pull/31) for `@inkcre/ui-web@1.2.3`.
Its first `UI checks` execution required a manual rerun because the PR was
created by `github-actions[bot]`. The rerun then exposed a valid generated-file
failure:

```text
packages/web/package.json       1.2.2 -> 1.2.3
packages/web/src/version.ts     remained 1.2.2
```

The bounded local fix:

1. makes `changeset:version` run `changeset version` and then regenerate package
   metadata;
2. configures `changesets/action@1.9.0` to use that version command when
   creating or updating the release PR;
3. makes the manual publish entrypoint reuse the same version command.

The pinned action's own `action.yml` confirms that its `version` input must run
the version/update command and that the default is `changeset version`. A
disposable clone rehearsed `1.2.2 -> 1.2.3`, generated the new version constant,
and passed `check:generated`.

This fix is implemented and locally verified. Sir explicitly authorized its
bounded commit and push on 2026-07-28. PR #31 must not be merged or used to
publish until the updated release PR is green.

## Cloudflare Pages Correction

The failed `Cloudflare Pages` check on PR #31 is independent of the package
generator defect. The authenticated deployment log proves that the Pages
project still stores the removed identity:

```text
Git repository: InKCre/design
Build command:   pnpm run --filter web-design story:build
Build output:    packages/web-design/.histoire/dist
```

The old Git URL redirect allowed cloning, but the old package filter matched no
workspace and the old output directory did not exist. The proposed bounded
correction is:

```text
Git repository: InKCre/ui
Build command:   pnpm story
Build output:    packages/web/.histoire/dist
Root directory:  unchanged (repository root)
```

Sir confirmed the external mutation. Cloudflare now stores `pnpm story`,
`packages/web/.histoire/dist`, and the unchanged repository root. Retried
deployment `2aae170b-edb4-4a14-a86c-86a6bfb51f96` built 21 stories / 108
variants, uploaded 96 files, deployed successfully, and changed the PR's
`Cloudflare Pages` check to pass.

The Dashboard still displays the cached `InKCre/design` source label, but the
Git integration received the renamed repository's release PR and cloned the
correct commit through GitHub's repository relationship. Updating that label
would require disconnecting and reconnecting the Git integration. Do not take
that more disruptive action while the functional event, clone, preview, and
deployment contracts are green.

## Remaining Closure Gates

1. Commit and push the authorized release-version synchronization fix so
   Changesets refreshes PR #31.
2. Prove the refreshed `Reproducible workspace check`, then add that exact
   context to the existing `main`/`develop` ruleset. Do not install a failing or
   unproven required check.
3. Merge/publish PR #31 only under an explicit release decision. Verify the new
   GitHub Package version, GitHub Release, exact-version consumer installation,
   and source association afterward.
4. Have the external Figma owner trigger one live `update-tokens` dispatch.
   Confirm that the renamed repository receives it and that the resulting PR
   contains validated token source, generated artifacts, and a package
   changeset. The deterministic fixture remains the required gate; the live
   dispatch is supplementary integration evidence.
5. Rename the local checkout directory to `ui` only at a session boundary.

## Rollback

The repository rename is reversible without deleting history or packages:

```text
gh repo rename design --repo InKCre/ui --yes
git remote set-url origin ssh://git@github.com/InKCre/design
```

After a rollback, recheck the stable repository ID, package source association,
Cloudflare Git/build settings, and the client Actions package-read run. The
published `@inkcre/ui-web@1.2.2` and immutable
`@inkcre/web-design@1.2.2` artifacts remain available; no unpublish or package
rewrite is part of rollback.
