# Execution 05 — Local Identity Migration And New Package Publication

Execution 05 was explicitly authorized by Sir on 2026-07-27. This record owns the local identity transition and the first exact-version publication of the new package; consumer mutation and remote repository rename remain outside this slice.

## Delivered Locally

- Renamed the private workspace from `inkcre-design` to `@inkcre/ui`.
- Moved the web package from `packages/web-design` to `packages/web`.
- Renamed the published package from `@inkcre/web-design` to `@inkcre/ui-web` while retaining version lineage at `1.2.2`.
- Renamed the Vite library identifier to `InKCreUIWeb`.
- Updated generators, Histoire, documentation, changesets, package metadata, generated Agent Skills, lockfile importers, and developer examples to the new identity.
- Preserved all `Ink*` component APIs, `.ink-*` CSS classes, token APIs, and accurate Design System/design-token vocabulary.
- Set the leaf package and Changesets access policy to restricted/private GitHub Packages publication.
- Added a package-local migration guide that freezes `@inkcre/web-design@1.2.2` as the immutable rollback artifact, rejects a forwarding wrapper without evidence of unknown consumers, and defers deprecation until known consumers have migrated.
- Recorded `../client-web` revision `71a64fd` as the bounded pre-migration consumer state.

## Publication And Registry Proof

- Published `@inkcre/ui-web@1.2.2` to the InKCre GitHub Packages npm registry after confirming that the exact version did not already exist.
- GitHub reports one version, private visibility, and registry integrity `sha512-26u+VHciYNpPN9BHwwMoqqPWPN56JsNoa1n5ZkfY7aE5Rq/UwUuVgrWpY1tfzRBo9ec+Fvu1IT4lBj8xLhs9ug==`.
- A disposable empty project installed the exact registry version with lifecycle scripts disabled and successfully imported the package root, version export, and Vue plugin.
- Linked the package to the current `InKCre/design` source repository. Execution 08 will rename that repository to `InKCre/ui`; no premature remote rename was performed here.
- Granted `InKCre/client-web` GitHub Actions access with the `Read` role. No Codespaces access or broader package visibility was added.
- Kept `@inkcre/web-design@1.2.2` installable and undeclared as deprecated. Consumer manifests remain unchanged until Execution 06.

## Verification

| Gate | Result |
|---|---|
| reproducible packed old-name `@inkcre/web-design@1.2.2` identity contract | pass |
| reproducible packed new-name `@inkcre/ui-web@1.2.2` contract | pass |
| exact GitHub Packages version and integrity | `1.2.2`; verified |
| disposable exact-version registry install and ESM import | pass |
| package visibility and source association | private; `InKCre/design` |
| `client-web` Actions package access | `Read` |
| package changeset status | patch release for `@inkcre/ui-web` |
| `../client-web` worktree | unchanged |

The old-name contract gate re-identifies and repacks the current repaired artifact
as `@inkcre/web-design`; it is a reproducible identity-compatibility probe, not a
byte-for-byte assertion about the immutable historical registry tarball. The
registry artifact is separately proven to remain available for the existing
consumer rollback path.

## Deferred By Design

- `@inkcre/web-design` is not deprecated until Execution 06 completes.
- `../client-web` manifest, lockfile, aliases, and runtime imports are unchanged until Execution 06.
- The optional local source overlay remains Execution 07.
- Remote repository rename and local checkout rename remain Execution 08 and require their own authorization.
