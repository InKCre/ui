# `compName.story.vue` coding rulebook

## Core Principle

- A Story is a visual and behavioral contract, not a parameter matrix.
- Story exist to ensure that important states and behaviors never regress.

A Story represents one of the following:

1. A canonical semantic state
2. A state transition boundary
3. An edge case likely to regress
4. A design-forbidden or invalid state

Stories must NOT be used for:

- Exhaustive prop combinations
- Demonstrating all possible values
- Acting as a playground or sandbox
- Replacing documentation text

Stories must be readable without explanatory text. If a Story needs explanation, it likely belongs in the doc instead.

## Best Practices

Categorize variants into:

- Cannonical: Stable, long-term design commitments (required).
- State: Critical boundaries between internal states (recommended).
- Edge: Scenarios most likely to break layout or behavior (recommended).
- Invalid: States that must not be relied upon (optional).

Titles must be descriptive, semantic, stable over time.

## Minimal Checklist

Before committing a `*.story.vue`, ensure:

- [ ] At least one cannonical variant exists
- [ ] At least one state or edge variant exists
- [ ] No exhaustive prop combinations are present
- [ ] All Story titles communicate intent
- [ ] All Variants represent meaningful states

## Other Notes

- Cannot use provide/inject in story, use it in `histoire.setup.ts`
