# InkDatetimePickerView

A comprehensive picker view for selecting weekday, date, and time values.

## Rationale

Provides an interactive picker interface for datetime selection, triggered by InkPicker. Use when needing scrollable columns for weekday, date, and time selection. Avoid for simple text input or non-scrollable pickers.

## Design Semantics

### Concepts

- `Weekday`: Selectable day of the week.
- `Date`: Year, month, day selection.
- `Time`: Hour and minute selection.

### Visual / UX Meaning

Scrollable columns represent selectable values. Enabled columns show active selection; disabled columns are hidden. User perceives smooth scrolling and immediate feedback on selection changes.

## Canonical Examples

- Datetime mode: Full selection with weekday, date, and time.

  ```vue
  <InkDatetimePickerView v-model="selectedDate" mode="datetime" />
  ```

- Date only: Select date without time.

  ```vue
  <InkDatetimePickerView v-model="selectedDate" mode="date" />
  ```

## Behavioral Contract

- Emits `update:modelValue` on value change.
- Emits `confirm` on user confirmation.
- Emits `cancel` on cancellation.
- Respects minDate and maxDate limits.
- Hour format affects time display (12 or 24).

## Extension & Composition

Composes with InkPicker for modal display. Supports controlled usage via v-model.

## Non-Goals

Handling data persistence or business logic. Not for direct keyboard input.

## Implementation Notes

Uses scrollable columns for selection. Manages internal state for current selections. Relies on Vue reactivity for updates.
