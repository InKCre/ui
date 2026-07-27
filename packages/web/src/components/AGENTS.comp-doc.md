# `compName.docs.md` rulebook

## Best Practices

- Story-driven, tells what this component can do, what can't do.
- Every story should be an executable specification, not demo.
- Maintain API (props, emits) in the code, not document.
- Write for Coding Agents. Pay attention to Token Efficiency. Use simple and concise language.

## Scaffold

The words in `>` is what you (agent) need to follow, do NOT includes in the final document.

````md
# CompName

> Simple description of the problem this component solves.

## Rationale

> Explain Why this component exists. 

> Define when to use and when not to use.

## Design Semantics

### Concepts

> For example:
> - `ConceptA`: one-sentence definition
> - `ConceptB`

### Visual / UX Meaning

> The semantic differences between states / variants. 
> What changes the user is expected to perceive

## Canonical Examples

> The examples represent canonical usage, not an exhaustive combination of all parameters. For example:
> - Subtle(default): Used as the normal/secondary action.
>   ```vue
>   <InkButton text="Save" theme="primary" />
>   ```
> 

## Behavioral Contract

> Behavioral guarantees consumers can rely on. For example:
> - In `loading` state:
>   - No primary events should be emitted
>   - No repeated submissions should occur
> - In `disabled` state:
>   - No hover / active feedback
> - State transitions should be idempotent
> - No uncaught exceptions should be thrown

## Extension & Composition

> For example:
> - Can be composed with `CompGroup` / `FormItem`
> - Supports both controlled and uncontrolled usage
> - Not recommended to nest inside high-frequency reflow containers

## Non-Goals

> Explicitly out of scope for this component. For example:
> - Handling permissions or authorization logic
> - Data persistence
> - Business workflow orchestration

## Implementation Notes

> Notes for maintainers, for example:
> - Internal state is managed via `useXXX`
> - Relies on browser capabilities such as `ResizeObserver`
> - Notes on handling SSR / non-DOM environments
> Note do not repeat project level implementation notes.
````

## References

- [Histoire Docs Guide](https://histoire.dev/guide/vue3/docs.html)
