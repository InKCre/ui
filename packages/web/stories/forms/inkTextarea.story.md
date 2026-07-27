# InkTextarea

A multi-line text input component for forms.

## Rationale

InkTextarea exists to allow users to input or display multi-line text, integrating with forms for consistent layout.

Use it for comments, descriptions, or any multi-line text input; avoid using it for single-line inputs.

## Design Semantics

### Concepts

- `editable`: whether the text can be edited.
- `rows`: number of visible lines.
- `placeholder`: hint text when empty.

### Visual / UX Meaning

- Editable: shows textarea for input.
- Read-only: displays formatted text.
- Integrates with InkField in forms for labeling.

## Canonical Examples

- Basic editable textarea: For user input.

  ```vue
  <InkTextarea v-model="description" rows="4" />
  ```

- In form with label: Automatic field layout.

  ```vue
  <InkForm>
    <InkTextarea label="Comments" v-model="comments" />
  </InkForm>
  ```

- Read-only display: Showing text.

  ```vue
  <InkTextarea :value="bio" :editable="false" />
  ```

## Behavioral Contract

- In editable mode: emits update:value on input.
- In read-only: displays value as text.
- When in form with label: uses InkField for layout.

## Extension & Composition

- Supports v-model for two-way binding.
- Composes with InkForm for validation and layout.

## Non-Goals

- Single-line text input.
- Rich text editing.

## Implementation Notes

- Uses reusable template for conditional rendering.
- Injects form context for integration.
