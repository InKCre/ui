# `packages/web/components` coding guide

## File Structure

Each component has a folder (`compName/`) containing the following files:

- `compName.vue`: template, component specific logic, [guide](./AGENTS.comp-vue.md)
- `compName.ts`: component props, emits, models, types, constants, utilities, [guide](./AGENTS.comp-ts.md)
- `compName.scss`: component styles, [guide](./AGENTS.comp-scss.md)
- `compName.test.ts`: component unit test

Public component identity and category belong to
`../../component-manifest.json`. Histoire stories and component documentation
live outside runtime source in `../../stories/<category>/`:

- `compName.story.md`: component documentation, [guide](./AGENTS.comp-doc.md)
- `compName.story.vue`: component (Histoire) story, [guide](./AGENTS.comp-story.md)

## Best Practices

- Single Responsibility Principle
- High Cohesion and Low Coupling
- Clear and consistent API
- Avoid prop drilling
- Easy to Test and Maintain

### Naming

- `camelCase` for component name, variables, functions
- `kebab-case` for selectors, events

### Error Handling

- Graceful degradation
- User-friendly error messages
- Logging

## Task Checklist

> ALWAYS Check this list once you made changes to components

- [ ] Update `../../stories/<category>/compName.story.md` to plan the changes
- [ ] Ensure type-safety (avoid `any`, `unknown`)
- [ ] Update `compName.test.ts` and pass the test
- [ ] Update `../../stories/<category>/compName.story.vue`
- [ ] Ensure code match `compName.story.md`
