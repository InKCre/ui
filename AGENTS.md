# InKCre UI

This repository owns the InKCre design system and UI libraries.

Reason in English. Communicate with humans in Chinese.

## Repository Map

- `packages/web/`: `@inkcre/ui-web`, its public components, styles, stories,
  generated consumer skill, and package-local instructions.
- `tokens/inkcre.tokens.json`: W3C DTCG design-token source.
- `scripts/`: deterministic token, package-metadata, Agent Skill, contract, and
  release preparation commands.
- `docs/index.md`: durable documentation navigation.
- `tasks/`: volatile task packets retained only while their parent task is active.

## Knowledge Owners

- Repository and package entry points: `README.md` and `packages/web/README.md`.
- Public package API: package exports, component manifest, TypeScript source,
  generated declarations, and styles.
- Component usage evidence: `packages/web/stories/`.
- UI consumer Agent guidance: `packages/web/skill.seed.json` and the generated
  `packages/web/skills/ui-web/` artifact.
- Package migration contract: `packages/web/MIGRATION.md`.
- Build, release, preview, and production behavior: package scripts, repository
  scripts, and `.github/workflows/`.
- Repeated subtree hazards: the nearest local `AGENTS.md`.

## Coding Guidelines

- [Coding for Human](/.github/instructions/coding-for-human.instructions.md)

## Development Workflow

- Follow the organization-wide [Git and GitHub Governance](https://github.com/InKCre/.github/blob/main/GOVERNANCE.md)
  and [contribution workflow](https://github.com/InKCre/.github/blob/main/CONTRIBUTING.md) for branches, pull requests,
  release authority, and delivery boundaries; repository-local documents own exact commands.
- Runtime: Node.js 22.22.3; package manager: pnpm 11.17.0.
- Install with `pnpm install --frozen-lockfile`; run the full contract with
  `pnpm check`.
- Use `pnpm changeset` for an observable published-package change.
- Generated tokens, package metadata, and `skills/ui-web` are checked-in
  projections. Change their source owner and run `pnpm generate`; do not edit
  generated output directly.
- Follow the organization-wide [Verification and Test Policy](https://github.com/InKCre/.github/blob/main/TESTING.md).
  This repository prefers type-check, lint, generated-contract checks, story builds, and real
  consuming-page review; it currently admits no automated unit/component suite.
- Require explicit Human authorization before commit, push, publication, or
  external repository/settings mutation.

<!-- svc:begin -->
## SVC

Use `svc --help` or `svc <command> --help`.

- `svc status`: inspect project state
- `svc lookup`: read SVC guidance
- `svc task init`: create a task packet
- `svc task grow`: inspect packet shape without changing files
- `svc dev`: manage declared development targets

If `AGENTS.local.md` exists, read it after this file. It is ignored local guidance; shared rules belong here.
<!-- svc:end -->
