# InkField

A component for displaying and editing key-value pairs in forms.

## Rationale

InkField exists to provide a consistent way to display labels and values in forms, supporting different layouts and editability.

Use it for form fields where you need a label and a value display or input; avoid using it for standalone labels or values without context.

## Design Semantics

### Concepts

- `layout`: arrangement of label and value (`inline`, `col`, `row`).
- `editable`: whether the value can be interacted with.
- `required`: indicates mandatory field.

### Visual / UX Meaning

- `inline`: label and value on the same line; value underlined and clickable if editable.
- `col`: label above value in a column.
- `row`: label and value side by side.

## Canonical Examples

- Inline editable field: Used for compact forms.

  ```vue
  <InkField label="Name" value="John Doe" />
  ```

- Column layout: For structured forms.

  ```vue
  <InkField label="Email" layout="col">
    <InkInput v-model="email" />
  </InkField>
  ```

- Required field: Indicates mandatory input.

  ```vue
  <InkField label="Password" required layout="col">
    <InkInput type="password" v-model="password" />
  </InkField>
  ```

## Behavioral Contract

- In editable state: value is clickable and emits 'value-click'.
- Required fields display a red asterisk next to the label.
- Layout changes affect positioning but not functionality.

## Extension & Composition

- Supports slot for custom value content (e.g., inputs, pickers).
- Can be used in forms with InkForm.

## Non-Goals

- Handling validation or submission logic.
- Data persistence.

## Implementation Notes

- Uses computed classes for layout and state.
- Relies on Vue slots for flexibility.
