# InkDropdown

# InkDropdown

A form control component for selecting a single option from a dropdown list with support for lazy-loaded options, search functionality, and optional stepping controls.

## Rationale

Provides a consistent dropdown selection control that supports both static and dynamically loaded options. Use for single selection from a list, especially when options need to be loaded on-demand. Includes built-in search for filtering options and optional keyboard navigation via stepping buttons.

## Design Semantics

### Concepts

- Static options: Pre-defined array of options passed directly to the `options` prop
- Lazy-loaded options: Options loaded on-demand via the `refresher` function when the dropdown is opened, or immediately on mount if `modelValue` is set
- Search: Type-to-search functionality for filtering options by label or description
- Stepping: Optional previous/next buttons for keyboard-based navigation through options
- Option descriptions: Optional secondary text displayed below option labels

### Visual / UX Meaning

The dropdown displays as a box showing the selected value or placeholder. When editable, a chevron icon indicates interactivity. Opening reveals a list of filtered options. Search is initiated by typing alphanumeric characters. Loading state shows a spinner. Refresh button allows manual reload for lazy options. Stepping buttons enable arrow-like navigation without opening the dropdown. Option descriptions provide additional context.

## Canonical Examples

- Basic static options with label:

  ```vue
  <InkDropdown
    v-model="selected"
    label="Choose option"
    :options="[
      { value: 'a', label: 'Option A' },
      { value: 'b', label: 'Option B' },
    ]"
  />
  ```

- Lazy-loaded options with refresh:

  ```vue
  <InkDropdown
    v-model="selected"
    :refresher="
      async () => [
        { value: '1', label: 'Loaded 1' },
        { value: '2', label: 'Loaded 2' },
      ]
    "
  />
  ```

- With options containing descriptions:

  ```vue
  <InkDropdown
    v-model="selected"
    :options="[
      { value: 'a', label: 'Option A', description: 'First option' },
      { value: 'b', label: 'Option B', description: 'Second option' },
    ]"
  />
  ```

- With stepping controls for keyboard navigation:

  ```vue
  <InkDropdown v-model="selected" :options="staticOptions" :enable-stepping="true" />
  ```

- Dynamic options with manual refresh:

  ```vue
  <InkDropdown v-model="selected" v-model:options="dynamicOptions" :refresher="loadOptions" />
  ```

## Behavioral Contract

- Dropdown only opens and closes when `editable` is true
- In loading state: No selection possible, loading indicator shown, refresh button disabled
- Selection emits both `update:modelValue` and `change` events
- Refresh button reloads options asynchronously (only shown when `refresher` is provided)
- When `modelValue` is set on mount with a `refresher` function, options are loaded immediately to display the correct label
- Keyboard navigation when dropdown is open:
  - Arrow Down/Up navigates through options with circular wrapping
  - Enter selects the currently hovered option
  - ESC closes the dropdown
- Search is initiated by pressing alphanumeric keys when dropdown is open
  - Arrow Down/Up navigates through filtered options
  - ESC clears search first, then closes dropdown if search is empty
  - Enter selects the currently hovered option (or first if none hovered)
  - Search text filters options by both label and description
- Stepping buttons (when `enableStepping` is true):
  - Disabled when dropdown is not editable or no options exist
  - Cycle through options in order
  - Work independently of dropdown being open
- All state transitions are idempotent

## Extension & Composition

- Composes with InkForm for consistent form layouts via the `label` prop
- Supports optional two-way binding of options via `v-model:options`
- Integrates with form context for layout consistency

## Non-Goals

- Multi-selection
- Custom option rendering templates
- Data persistence or authorization logic

## Implementation Notes

- Internal state managed via reactive refs for options, search text, hovering, and loading
- Uses Vue 3 Composition API and reactivity
- Handles async loading with promises
- Keyboard events enable search on alphanumeric input
- Search filters both label and description fields
- Hover state tracks currently hovered option during search

## Props

```typescript
export const inkDropdownProps = {
  ...formControlCommonProps,
  options: {
    type: Array as PropType<DropdownOption[]>,
  },
  refresher: {
    type: Function as PropType<() => Promise<DropdownOption[]>>,
  },
  modelValue: {
    type: [String, Number] as PropType<
      DropdownOption["value"] | undefined | null
    >,
    default: "",
  },
  placeholder: makeStringProp("Select an option"),
  displayAs: makeStringProp<"box">("box"),
  enableStepping: makeBooleanProp(false),
} as const;
```

## Events

```typescript
export const inkDropdownEmits = {
  "update:modelValue": (value: DropdownOption["value"]) => true,
  change: (value: DropdownOption["value"]) => true,
  "update:options": (options: DropdownOption[]) => true,
} as const;
```

## Types

```typescript
interface DropdownOption {
  label: string;
  value: string | number;
  description?: string;
  [key: string]: any;
}
type DropdownOptionsSource = DropdownOption[];

// --- Props ---
export const inkDropdownProps = {
  ...formControlCommonProps,
  options: {
    type: Array as PropType<DropdownOption[]>,
  }
```

## Import

```typescript
import { InkDropdown } from '@inkcre/ui-web';
```
