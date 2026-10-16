# InKCre UI

The InKCre design system and UI libraries. Ships `@inkcre/ui-web`, the design-token source, and the generated consumer Agent skill consumed by InKCre peers.

## Mental Model

InKCre is a system of heterogeneous peers sharing one info-base. Peers differ in runtime capability, not in authority: no fixed frontend/backend hierarchy exists.

UI is a cross-cutting product surface, not a peer implementation. Any peer that renders to a human — web, browser extension, future native — consumes the same design system. The design system owns design relationships, visual language, and component APIs; consuming peers own business flows and layout.

Design tokens are the single source for names, types, values, and references. Figma proposes value updates to existing paths; it does not author the token schema. Components and their TypeScript declarations own API facts. Stories own usage evidence.

## Knowledge Owners

`ui` is an SVC Spoke. Shared Hub truth is mounted read-only at `docs/_shared/` (git submodule → `InKCre/docs`).

- Design stance, visual language, composition, and rationale: `DESIGN.md` and `docs/design/`
- Design-token source: `tokens/inkcre.tokens.json` (see `tokens/tokens.md` for format and maintenance)
- Public package API: `packages/web/` exports, component manifest, TypeScript sources, generated declarations, styles
- Component usage evidence: `packages/web/stories/`
- UI consumer Agent guidance: `packages/web/skill.seed.json` and the generated `packages/web/skills/ui-web/`
- Package migration contract: `packages/web/MIGRATION.md`
- Build, release, preview, and production behavior: package scripts, repository scripts, `.github/workflows/`
- Product behavior and language: `docs/_shared/10-prd/`
- Cross-unit contracts and topology: `docs/_shared/20-product-tdd/`
- Volatile task state: `tasks/`
- Subtree-specific hazards: the nearest local `AGENTS.md`

## Repository Map

- `packages/web/`: `@inkcre/ui-web` package — public components, styles, stories, generated consumer skill, package-local instructions
- `tokens/inkcre.tokens.json`: design-token source using `type/value`
- `scripts/`: deterministic token, package-metadata, Agent-skill, contract, and release-preparation commands
- `docs/design/`: design stance, visual language, page composition, judgment rationale
- `docs/index.md`: durable documentation navigation
- `tasks/`: volatile task packets

## Development Constraints

- Runtime: Node.js 22.22.3; package manager: pnpm 11.17.0. Exact commands live in `package.json` and repository scripts.
- Generated tokens, package metadata, and `skills/ui-web` are checked-in projections. Change their source owner and run `pnpm generate`; do not edit generated output directly.
- Use `pnpm changeset` for any observable published-package change.
- Changing a public name, purpose, default behavior, or interaction promise requires synchronized updates to the implementation, design prose, examples, and migration notes.
- Visual acceptance requires naming the comparison basis; reporting only "tokens are valid" or "build succeeded" is not acceptance.

## Governance And Workflow

- Git and GitHub workflow: [Git and GitHub Governance](https://github.com/InKCre/.github/blob/main/GOVERNANCE.md) and [Contributing](https://github.com/InKCre/.github/blob/main/CONTRIBUTING.md)
- Verification and test selection: [Verification and Test Policy](https://github.com/InKCre/.github/blob/main/TESTING.md)
- Coding guidelines: `.github/instructions/coding-for-human.instructions.md`
- Hub-Spoke shared-doc workflow: `.agents/skills/edit-svc-shared-docs/`

<!-- svc:begin -->
## SVC

Use `svc --help` or `svc <command> --help`.

- `svc status`: inspect project state
- `svc dev`: manage declared development targets

If `AGENTS.local.md` exists, read it after this file. It is ignored local guidance; shared rules belong here.
<!-- svc:end -->
