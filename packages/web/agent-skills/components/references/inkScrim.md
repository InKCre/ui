# InkScrim

````markdown
# InkScrim

A simple, full-screen scrim (overlay) component for blocking background interaction and creating focus on overlay content.

## Rationale

InkScrim exists to provide a lightweight, reusable backdrop overlay that dims the background and can be dismissed via user interaction. It serves as a building block for modal, drawer, and other overlay-based components.

Use it for:

- Creating a dismissible background overlay for dialogs and modals
- Blocking interaction with background content
- Creating visual hierarchy by dimming background
- Building custom overlay-based components

Avoid using it for:

- General page dimming without overlay content (use CSS instead)
- Permanent background effects (scrim should be dismissible)
- Complex modal interactions (use InkPopup or InkDialog instead)

## Design Semantics

### Concepts

- `open`: Boolean state controlling scrim visibility
- `closeOnScrim`: Whether clicking the scrim closes it
- `scrim-click`: Event emitted when scrim is clicked

### Visual / UX Meaning

- **Scrim**: Semi-transparent dark overlay (`rgba(0, 0, 0, 0.5)`) covering entire viewport
- **Fade Transition**: Smooth opacity transition when opening/closing
- **Full Screen**: Fixed positioning covering entire visible area
- **Clickable**: Can be clicked to trigger close or emit event

## Canonical Examples

- Basic scrim overlay:

  ```vue
  <InkScrim v-model:open="isOpen" />
  ```

- Non-dismissible scrim (blocks closing on click):

  ```vue
  <InkScrim v-model:open="isOpen" :close-on-scrim="false" />
  ```

- Scrim with custom handler:

  ```vue
  <InkScrim v-model:open="isOpen" @scrim-click="handleScrimClick" />
  ```

## Behavioral Contract

- Scrim is rendered via Teleport to body (renders at top of DOM hierarchy)
- Clicking scrim emits `scrim-click` event
- If `closeOnScrim` is true, clicking scrim also closes it (updates v-model)
- If `closeOnScrim` is false, clicking scrim only emits event
- Fade transition plays smoothly when opening/closing
- Scrim has fixed positioning covering entire viewport
- Z-index is 999 to ensure it's above most content

## Extension & Composition

- Used as building block for InkPopup, InkDialog, and custom overlay components
- Can be combined with positioned content overlays for modals
- Works with any content that needs background dimming

## Non-Goals

- Does not provide positioning or layout for overlay content
- Does not handle keyboard interactions (handled by parent components)
- Does not provide animations beyond simple fade
- Does not enforce modal behavior (parent component responsibility)

## Implementation Notes

- Props: `closeOnScrim` (boolean, default: true)
- Emits: `scrim-click`
- Model: `v-model:open` for state control
- Test IDs: `ink-scrim`
- Uses Teleport to body for proper z-index management
- Fixed positioning covers entire viewport
- Semi-transparent dark background (`rgba(0, 0, 0, 0.5)`)
- Smooth fade transition (0.3s ease)
````

## Props

```typescript
export const inkScrimProps = {
  closeOnScrim: makeBooleanProp(true),
  closeOnEscape: makeBooleanProp(true),
  showCloseButton: makeBooleanProp(false),
} as const;
```

## Events

```typescript
export const inkScrimEmits = {
  "scrim-click": () => true,
  close: () => true,
  "update:open": (value: boolean) => true,
} as const;
```

## Import

```typescript
import { InkScrim } from '@inkcre/ui-web';
```
