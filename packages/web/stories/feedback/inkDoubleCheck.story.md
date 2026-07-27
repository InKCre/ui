# InkDoubleCheck

Provides a confirmation mechanism for destructive or irreversible actions, preventing accidental clicks.

## Rationale

InkDoubleCheck exists to add a layer of confirmation for actions that could have significant consequences, such as deletions or irreversible changes. Use it when wrapping clickable elements that trigger such actions to avoid accidental executions. Do not use it for non-destructive actions or where confirmation is not necessary.

## Design Semantics

### Concepts

- `Confirmation Popup`: A modal dialog that appears on click, requiring user acknowledgment before proceeding.

### Visual / UX Meaning

The component maintains the original clickable element's appearance until clicked. Upon click, a popup overlays with a title, message, and action buttons. The confirm button is emphasized to guide the user towards confirmation, while cancel allows dismissal. States include open (popup visible) and closed (default).

## Canonical Examples

- Basic confirmation for a delete button:

  ```vue
  <InkDoubleCheck @confirm="deleteItem">
    <InkButton text="Delete" />
  </InkDoubleCheck>
  ```

## Behavioral Contract

- Click events on the wrapped element are intercepted and do not propagate until confirmation.
- The `confirm` event is emitted only after the user clicks the confirm button in the popup.
- The popup closes on either confirm or cancel, resetting the component to its initial state.
- No actions are performed if the popup is dismissed via cancel.

## Extension & Composition

- Can be composed with any clickable component via the default slot.
- Supports customization of popup text through props.
- Not recommended for use inside forms where validation might conflict.

## Non-Goals

- Handling the actual destructive action logic.
- Managing user permissions or authentication.
- Providing advanced popup customization beyond text.

## Implementation Notes

- Uses a slot to wrap the clickable element and attaches event listeners.
- Relies on a popup component for the confirmation dialog.
- State management handles popup visibility and event emission.
