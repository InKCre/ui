# Execution 08B — Intent-Based Agent Skill Delivery

Execution 08B is complete and published in `@inkcre/ui-web@1.3.0`. Sir
authorized it on 2026-07-28 together with the web DX slice after consumer and
remote identity closure. Release PR #31 merged, and the exact registry
artifact passed installed-package discovery and loading.

## Problem Statement

The current package publishes five folders under `agent-skills/` and describes
them as automatically discoverable. TanStack Intent does not scan that path;
it discovers `skills/**/SKILL.md` at the installed package root. Running the
current pinned candidate against this repository reports no `skills/`
directory, so the present delivery claim is not mechanically true.

The current content is also organized around documentation categories
(`components`, `router`, `i18n`, `styling`, and generic best practices) rather
than the developer's intent. It can enumerate APIs, but it does not reliably
teach an agent how to select and compose InKCre components for a product task.

## Reference Interpretation

`partner-up-dev/ui` provides the useful model, but TanStack Intent is only one
layer of that model:

- Intent owns the standard package path, structural validation, installed
  package discovery, trust allowlist, and `package#skill` loading.
- PartnerUp's own generator still owns component/source/story extraction,
  curated intent, composition knowledge, caveats, references, and
  deterministic output.

InKCre should adopt that separation instead of expecting Intent to infer the
library's domain model or replacing one generated documentation dump with
another.

## Target Shape

```text
packages/web/
├── skill.seed.json
└── skills/
    └── ui-web/
        ├── SKILL.md
        └── references/
            ├── component-map.md
            ├── composition-recipes.md
            ├── integration.md
            ├── styling-and-themes.md
            ├── common-mistakes.md
            └── components/
                └── Ink*.md
```

- `ui-web` is the one discoverable skill and intent router for the package.
- `SKILL.md` begins with task selection and composition workflow, then loads
  only the relevant references.
- `skill.seed.json` is the curated semantic input for intents, preferred use,
  avoid/caveat rules, composition partners, and durable source references.
- `component-manifest.json` remains the sole public-component authority.
- Component facts and maps are generated; product judgment and composition
  guidance are explicit reviewed inputs.

## Compatibility Decision

Make a clean cut from `agent-skills/` to `skills/`:

- `@inkcre/ui-web` has only just been published under the new identity and has
  not yet been adopted by the known consumer.
- Repository and `../client-web` searches find no direct consumer of the old
  file paths or skill IDs.
- The old path is not recognized by Intent, so maintaining a generated mirror
  would preserve an unproven contract and double the stale-output surface.

The change must still receive an explicit Changeset and migration note. If
direct-consumer evidence appears before implementation, compatibility is
reopened rather than silently adding a permanent mirror.

## Planned Work

1. Pin `@tanstack/intent` in `packages/web`; add the `tanstack-intent` keyword
   and publish `skills/` while excluding non-runtime generation artifacts.
2. Replace the five old skill roots with one `skills/ui-web` intent router and
   progressively disclosed references.
3. Evolve the existing generator instead of importing PartnerUp's generator.
   Read the component manifest, reviewed seed, TypeScript/Vue source, and
   stories; write only the owned generated tree; support a no-write
   `--check` mode.
4. Encode useful selection/composition semantics such as form construction,
   feedback/confirmation, overlays, JSON editing, media fallbacks, theming,
   router/i18n integration, and known failure modes.
5. Add package-local `skill:generate`, `skill:generate:check`, and
   `skill:validate` commands. Use the lockfile-pinned Intent binary.
6. Keep custom generation checks authoritative for source/story drift.
   `intent stale` remains informational until its source/sync metadata is
   deliberately populated and proven; an empty stale report is not a gate.
7. Extend the packed-package contract so a disposable consumer with an
   explicit `intent.skills` allowlist can run pinned `intent list` and
   `intent load @inkcre/ui-web#ui-web` against the extracted tarball.
8. Verify every referenced file is present in the tarball, no repository
   source path leaks, and two generation/check passes are byte-stable.
9. Release and registry-probe the resulting exact package version from the
   renamed `InKCre/ui` repository without reopening the completed consumer
   identity migration.

## Exit Proof

- `intent validate` accepts the canonical `skills/ui-web/SKILL.md` and package
  metadata with no packaging warning.
- The custom stale-generation check fails after a seeded component,
  story/source fact, or reference is changed without regeneration.
- The packed artifact contains `skills/`, excludes `agent-skills/` and
  maintainer-only artifacts, and exposes no new runtime export solely for
  Intent.
- In a disposable consumer, explicit allowlisting discovers exactly the
  installed `@inkcre/ui-web#ui-web` skill and loads a path inside that package.
- The root check, package build, packed consumer contract, and Histoire build
  remain green.
- A reviewed Changeset records the delivery-model change and the exact
  published version upgrades the already-migrated consumer through the normal
  release path rather than serving as its identity-migration prerequisite.

## Implemented Result

- The retired five-folder `agent-skills/` tree is removed. The package now
  publishes one canonical `skills/ui-web` skill and advertises
  `tanstack-intent`.
- `skill.seed.json` contains reviewed selection, avoidance, composition,
  integration, styling, and failure-mode judgment. It is a maintainer input
  and is excluded from the tarball.
- The generator reads the public component manifest, reviewed seed,
  TypeScript/Vue component facts, and story variants. It validates exact seed
  coverage and composition references, then owns exactly 27 deterministic
  files: one router, five shared references, and 21 component references.
- Package-local commands generate, check, and validate the skill. The root
  generated-output and canonical check paths delegate to those commands.
- Package and migration documentation describe explicit Intent trust
  allowlisting, discovery, loading, and the clean cut from `agent-skills/`.
- A minor Changeset records the combined web-DX and skill delivery contract.

## Local Proof

- Pinned `@tanstack/intent@0.3.6` validates exactly one skill with no packaging
  warning.
- Two generation passes produce the same aggregate SHA-1
  `e440b025445006c64e151b0c0f5adf51de3d24c7`.
- A seed-only stale fixture fails on the component map and affected component
  reference. A story-only stale fixture fails on the affected component
  reference.
- Both new-name and reproducible old-name tarball probes contain `skills/`,
  exclude `agent-skills/` and `skill.seed.json`, validate all Markdown
  references, and expose no repository source paths.
- A disposable consumer allowlists the packed package, discovers exactly
  `@inkcre/ui-web#ui-web`, and loads a real path inside the extracted tarball.
- The working and frozen-install root checks pass Intent, generation,
  package-contract, tests, build, and Histoire.
- Sir authorized the bounded commit and release-PR merge on 2026-07-28.
  Commit `f9a65a3` passed CI; release PR #31 merged as `7b0034c`, and the exact
  `@inkcre/ui-web@1.3.0` registry artifact passed installed-package discovery
  and loading.

## Primary References

- [TanStack Intent overview](https://tanstack.com/intent/latest/docs/overview)
- [Intent maintainer quick start](https://tanstack.com/intent/latest/docs/getting-started/quick-start-maintainers)
- [Intent configuration and trust allowlist](https://tanstack.com/intent/latest/docs/concepts/configuration)
- [partner-up-dev/ui web skill](https://github.com/partner-up-dev/ui/tree/main/packages/web/skills/ui-web)
