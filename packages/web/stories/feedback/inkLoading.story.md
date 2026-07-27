# InkLoading

A loading indicator for asynchronous operations.

## Rationale

InkLoading exists to provide visual feedback during loading states, using an animated sequence of blocks.

Use it for loading screens or inline loading; avoid using it for static placeholders.

## Design Semantics

### Concepts

- `size`: dimensions of the blocks (`xs`, `sm`, `md`).
- `density`: spacing between blocks (`sm`, `md`).

### Visual / UX Meaning

- Animated pulsing blocks indicate ongoing process.
- Size affects prominence; density affects compactness.

## Canonical Examples

- Default loading: Standard size and density.

  ```vue
  <InkLoading />
  ```

- Small compact: For tight spaces.

  ```vue
  <InkLoading size="sm" density="sm" />
  ```

## Behavioral Contract

- Continuous animation loop.
- No user interaction; purely visual.

## Extension & Composition

- Can be overlaid on content or used inline.

## Non-Goals

- Progress indication or text labels.
- Interactive elements.

## Implementation Notes

- Uses CSS keyframes for animation.
- Sequential delays for wave effect.
