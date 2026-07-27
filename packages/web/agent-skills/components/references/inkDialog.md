# InkDialog

# inkDialog

A dialog component built on top of inkPopup, providing a complete modal dialog experience with built-in header, footer, and action buttons.

## Features

- Built-in cancel and confirm buttons
- Support for title and subtitle
- Multiple slots (default/content, header, footer)
- Loading state support via Promise-based modelValue
- Flexible positioning
- Scrim (backdrop) with optional click-to-close

## Props

### modelValue

- **Type**: `boolean | Promise<boolean>`
- **Default**: `false`
- **Description**: Controls the open/close state of the dialog. When a Promise is provided, the dialog enters a loading state until the promise resolves.

### position

- **Type**: `DialogPosition` (string or array)
- **Default**: `"center"`
- **Options**: `"center"`, `"left"`, `"right"`, `"top"`, `"bottom"`, or `[top, right, bottom, left]` array
- **Description**: Position of the dialog on screen

### closeOnScrim

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Whether clicking the backdrop closes the dialog

### title

- **Type**: `string`
- **Default**: `""`
- **Description**: Dialog title text

### subtitle

- **Type**: `string`
- **Default**: `""`
- **Description**: Dialog subtitle text

### cancelText

- **Type**: `string`
- **Default**: `"Cancel"`
- **Description**: Text for the cancel button

### confirmText

- **Type**: `string`
- **Default**: `"Confirm"`
- **Description**: Text for the confirm button

### showCancel

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Whether to show the cancel button

### showConfirm

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Whether to show the confirm button

## Events

### update:modelValue

- **Payload**: `boolean`
- **Description**: Emitted when dialog state changes

### cancel

- **Description**: Emitted when cancel button is clicked

### confirm

- **Description**: Emitted when confirm button is clicked

## Slots

### default (content)

- **Props**: `{ cancel: Function, confirm: Function, isLoading: boolean }`
- **Description**: Main content area of the dialog

### header

- **Description**: Custom header content (replaces title and subtitle)

### footer

- **Description**: Custom footer content (replaces default buttons)

## Usage

### Basic Usage

```vue
<InkDialog v-model="dialogOpen" title="Confirm Action" subtitle="Are you sure?">
  <p>This action cannot be undone.</p>
</InkDialog>
```

### With Promise (Loading State)

```vue
<script setup>
import { ref } from "vue";

const dialog = ref(false);

const handleConfirm = () => {
  dialog.value = new Promise((resolve) => {
    // Perform async operation
    setTimeout(() => {
      resolve(false); // Close dialog
    }, 2000);
  });
};
</script>

<template>
  <InkDialog v-model="dialog" title="Processing" @confirm="handleConfirm">
    <p>Click confirm to start processing...</p>
  </InkDialog>
</template>
```

### Custom Content with Slot Props

```vue
<InkDialog v-model="dialogOpen">
  <template #default="{ cancel, confirm, isLoading }">
    <p>Custom content</p>
    <button @click="cancel">Cancel</button>
    <button @click="confirm" :disabled="isLoading">Confirm</button>
  </template>
</InkDialog>
```

## Props

```typescript
export const inkDialogProps = {
  modelValue: {
    type: [Boolean, Promise] as PropType<boolean | Promise<boolean>>,
    default: false,
  },
  position: {
    type: [String, Array] as PropType<DialogPosition>,
    default: "center",
  },
  closeOnScrim: makeBooleanProp(true),
  title: makeStringProp(""),
  subtitle: makeStringProp(""),
  cancelText: makeStringProp(""),
  confirmText: makeStringProp(""),
  showCancel: makeBooleanProp(true),
  showConfirm: makeBooleanProp(true),
} as const;
```

## Events

```typescript
export const inkDialogEmits = {
  "update:modelValue": (value: boolean) => typeof value === "boolean",
  cancel: () => true,
  confirm: () => true,
} as const;
```

## Types

```typescript
type DialogPosition =
  | "center"
  | "left"
  | "right"
  | "bottom"
  | "top"
  | [number, number, number, number]; // [top, right, bottom, left]

// --- Props ---
export const inkDialogProps = {
  modelValue: {
    type: [Boolean, Promise] as PropType<boolean | Promise<boolean>>,
    default: false,
  }
```

## Import

```typescript
import { InkDialog } from '@inkcre/ui-web';
```
