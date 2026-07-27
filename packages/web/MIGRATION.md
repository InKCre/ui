# Migrate from `@inkcre/web-design`

`@inkcre/ui-web` continues the `1.2.x` version lineage under the UI workspace
identity. The public API migration changes package identity only: Vue
components and types (`Ink*`), CSS classes (`.ink-*`), Sass APIs, and
design-token variables remain compatible.

## Consumer changes

1. Replace the dependency with the exact published `@inkcre/ui-web` version.
2. Replace `@inkcre/web-design` imports with `@inkcre/ui-web`, including
   `/styles`, `/styles/functions`, `/styles/mixins`, `/tokens/*`, `/utils`,
   `/locales`, and `/uno`.
3. Remove direct `node_modules` or `dist` aliases that worked around the old
   package's invalid exports map.
4. Perform a frozen install and run the complete consumer check before
   widening the version range.

## Dependency boundary

The republished package externalizes its declared peers instead of bundling
them. `vscode-languageserver-textdocument@^1.0.12` is now an explicit required
peer for `InkJsonEditor`; consumers do not import it directly, but their
package manager must resolve it in the installation graph. Execution 06 must
verify this through the committed consumer lockfile and frozen installation.

## Compatibility and rollback

- `@inkcre/web-design@1.2.2` is the immutable rollback artifact. It will not be
  unpublished or replaced by a forwarding wrapper.
- The pre-migration `client-web` revision is `71a64fd`. Execution 06 will
  record the bounded consumer migration commit; reverting that commit and
  restoring the prior lockfile returns all three known consumers to the old
  exact artifact.
- Deprecation of the old package happens only after the known consumers have
  migrated successfully.
