# InkSwitch

# InkSwitch

A toggle switch for binary state selection.

## Rationale

InkSwitch exists to allow users to toggle between two states, with support for async operations.

Use it for settings or preferences; avoid using it for multi-state selections.

## Design Semantics

### Concepts

- `modelValue`: boolean or promise for the state.
- `size`: visual size (`xs`, `sm`, `md`, `lg`).
- `showLabel`: whether to display on/off text.

### Visual / UX Meaning

- On state: switch to the right, green or active color.
- Off state: switch to the left, default color.
- Size affects touch target and prominence.

## Canonical Examples

- Basic toggle: On/off without labels.

  ```vue
  <InkSwitch v-model="enabled" />
  ```

- With labels: Showing state text.

  ```vue
  <InkSwitch v-model="enabled" showLabel />
  ```

- Async toggle: For operations that take time.

  ```vue
  <InkSwitch v-model="asyncToggle" />
  ```

## Behavioral Contract

- Clicking toggles the value and emits update.
- During async switching, prevents further clicks.
- Label shows 'ON' or 'OFF' based on state.

## Extension & Composition

- Supports v-model for two-way binding.
- Can be used in forms or settings panels.

## Non-Goals

- Multi-value selection.
- Complex state management.

## Implementation Notes

- Uses useAsyncState for promise handling.
- Computed classes for styling.

## Props

```typescript
export const inkSwitchProps = {
  modelValue: {
    type: [Boolean, Promise] as PropType<boolean | Promise<boolean>>,
    default: false,
  },
  // TODO add SizeItems type
  size: makeStringProp<"xs" | "sm" | "md" | "lg">("md"),
  showLabel: makeBooleanProp(true),
  offText: makeStringProp("OFF"),
  onText: makeStringProp("ON"),
  isSwitching: makeBooleanProp(false),
} as const;
```

## Events

```typescript
export const inkSwitchEmits = {
  "update:modelValue": (value: boolean) => true,
} as const;
```

## Import

```typescript
import { InkSwitch } from '@inkcre/ui-web';
```
