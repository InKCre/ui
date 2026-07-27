# InkButton

Just button, you can have text, icon here and provides different semantics in different sizes.

## Rationale

InkButton exists to provide a consistent visual and interactive affordance for primary actions, secondary actions, and destructive actions across the product.

Use it for any single-click action that requires a compact button UI; avoid using it when a non-single-click workflow is needed (for example, file uploads with progress, or long-running background tasks that need a separate action component).

## Design Semantics

### Concepts

- `theme`: visual and purposeful variant of the button (`subtle`, `primary`, `danger`).
- `type`: shape variant of the button (`default`, `square`).
- `size`: density of the control (`md`, `sm`).
- `icon`: iconfont class name (e.g., `i-mdi-cog`).
- `iconPlacement`: where to place the icon (`prefix`, `suffix`).
- `isLoading`: whether the button is in a loading state.
- `slot`: custom content (e.g., icon + label, label only).

### Visual / UX Meaning

- `subtle` (default): low emphasis, use for non-critical or contextual actions.
- `primary`: main action in a section or modal; higher contrast to attract attention.
- `danger`: destructive action that explains a potentially destructive outcome (e.g., delete).
- `sm`: smaller footprint for compact toolbars; `md`: default size used in forms and actions.
- `square`: used for icon-only buttons.

## Canonical Examples

- Subtle (default): Used as the normal/secondary action.

  ```vue
  <InkButton text="Cancel" />
  ```

- Primary: The primary action in a modal or a form footer.

  ```vue
  <InkButton text="Save" theme="primary" />
  ```

- Danger: Used for destructive actions where the user must confirm an operation.

  ```vue
  <InkButton text="Delete" theme="danger" />
  ```

- Small size: Use in dense toolbars or where space is constrained.

  ```vue
  <InkButton text="Edit" size="sm" />
  ```

- Icon: Use built-in icon prop.

  ```vue
  <InkButton text="Settings" icon="i-mdi-cog" />
  ```

- Loading: Show loading state.

  ```vue
  <InkButton text="Saving..." :isLoading="true" />
  ```

### Custom slot content (icon + label)

The `slot` is supported for custom content; this is how you add icons or non-text children.

```vue
<InkButton theme="primary">
  <div class="i-mdi-content-save" />
  <span>Save</span>
</InkButton>
```

## Behavioral Contract

- In all variants, clicking the button emits a `click` event.
- Click events are NOT emitted when `isLoading` is true.
- The default values are: `text` = "Button Text", `theme` = `subtle`, `type` = `default`, `size` = `md`.
- The component uses a native `<button>` element, so it inherits browser keyboard accessibility (space/enter) and form behavior.

## Extension & Composition

- The component is intentionally simple and is designed for composition via the `slot` and surrounding layout.
- Accepts custom slot content for icons or complex inline labels (icon + text).
- Works well inside `FormItem` or other containers.

## Non-Goals

- It does not provide variant-level keyboard shortcuts or automatic confirmation dialogs.
- It does not manage long-running workflows, API states, or request lifecycle (it only provides the `isLoading` visual state).

## Implementation Notes

- Props: `text` (string, default "Button Text"), `theme` (`subtle` | `primary` | `danger`, default `subtle`), `type` (`default` | `square`, default `default`), `size` (`md` | `sm`, default `md`), `icon` (string), `iconPlacement` (`prefix` | `suffix`, default `prefix`), `isLoading` (boolean, default `false`).
- Emits: `click` (always true), implemented as a regular native `<button>` click event via `emit('click')`.
- The `slot` is present and should be considered the source of truth for custom content; the `text` prop is a convenience when only a label is used.
- Accessibility note for maintainers: the component omits an explicit `type` attribute on the underlying `<button>`, so by default in HTML forms the button will behave as `submit`. When used inside a form where submission is not intended, the caller should pass a `type="button"` attribute to avoid accidental form submits.
