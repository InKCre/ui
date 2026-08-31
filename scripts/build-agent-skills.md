# UI Web Agent Skill

`build-agent-skills.ts` generates the single TanStack Intent skill shipped by
`@inkcre/ui-web` at `packages/web/skills/ui-web/`.

## Owners

- `packages/web/skill.seed.json` owns reviewed component intent, selection,
  composition, integration, styling, and mistake guidance.
- Component source, the public component manifest, and Histoire stories own
  mechanically derived API and variant facts.
- `scripts/build-agent-skills.ts` combines those sources into the generated
  skill and references. Generated files must not be edited directly.
- `scripts/check-package-contract.ts` proves the packed package exposes the
  skill at the discoverable `skills/ui-web` path and excludes the retired
  `agent-skills/` path and maintainer seed.

## Commands

```bash
pnpm build-skills
pnpm check:skills
```

Use `pnpm build-skills` after changing a source owner. `pnpm check:skills`
rejects stale generated output and validates the result with TanStack Intent.

This product skill belongs to the published UI package. Organization-wide
Agent workflow skills and repository instructions have different consumers
and do not belong in this package.
