# Execution 02 — Registry Authentication Boundary

Execution 02 was explicitly authorized by Sir on 2026-07-27. This record describes the bounded local implementation; it is not a publish, consumer mutation, package-visibility change, or remote package-access grant.

## Delivered

- Reduced the committed `.npmrc` to the `@inkcre` registry route. It contains no credential or environment-expanded credential placeholder.
- Documented the native interactive GitHub Packages login flow, the trusted user-config alternative, and direct package-manager remediation without adding an auth doctor.
- Removed the ineffective root `publishConfig`.
- Added the GitHub repository link and GitHub Packages registry to the publishable `@inkcre/web-design` package.
- Configured `actions/setup-node` with the `@inkcre` scope and GitHub Packages registry in PR and release workflows.
- Removed the unused Copilot setup workflow after Sir confirmed that the project no longer uses Copilot.
- Replaced `.node-version` and the root Node engine pin with pnpm's `devEngines.runtime`; CI setup-node steps now configure cache and registry without owning the project runtime.
- Removed shell `npm config set` calls from the release workflow.
- Declared explicit release permissions for repository changes and package publication.
- Bound `NODE_AUTH_TOKEN` only to the SHA-pinned Changesets action that performs the release operation. Frozen install and package lifecycle scripts do not receive it.
- Added a patch changeset for the publishable package metadata change.

The producer PR workflow intentionally retains only `contents: read`: its dependency graph contains no external private `@inkcre` package. `packages: read` belongs on a consumer job when that job actually installs a private package.

## Verification

| Gate | Result |
|---|---|
| missing auth with empty trusted config | native package-manager failure |
| temporary trusted user config referencing the process token | resolved `@inkcre/web-design@1.2.2` |
| disposable `../client-web` copy with trusted config and `--ignore-scripts` | frozen registry install passed; web, ext-dev-utils, and Twitter importers resolved `1.2.2` |
| committed `.npmrc` | exactly one scoped registry route |
| local `pnpm install --frozen-lockfile` | pass with no project-auth warning |
| pnpm-managed runtime | lock resolves `node@runtime:22.22.3`; `pnpm exec node` and `pnpm node` report `v22.22.3` |
| `pnpm check` | pass; 11 files / 103 tests and 21 stories / 108 variants |
| `pnpm changeset status` | patch bump for `@inkcre/web-design` |
| current GitHub Package metadata | private and linked to `InKCre/design` |

The auth proofs used a disposable npm-compatible user config and removed it afterward. They did not print or persist the process token and left the real user configuration and `../client-web` worktree unchanged. The consumer install disabled lifecycle scripts while the token was present.

## Remote Proof Still Pending

- The updated PR workflow has not run because no push was authorized.
- The release path has not published with its repository `GITHUB_TOKEN`; that proof requires a real release after the packed contract is repaired.
- The future `@inkcre/ui-web` package does not exist yet, so its visibility, repository inheritance, `client-web` Actions access, and Dependabot path cannot be configured or proven in this slice.
- The current package remains private. The new package's visibility is still an explicit decision before Execution 05.
