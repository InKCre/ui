# InkJsonEditor

# InkJsonEditor

A specialized textarea component for editing JSON with enhanced editing features.

## Rationale

InkJsonEditor exists to provide a consistent JSON editor field for forms with smart indentation, quote completion, and comma completion to streamline JSON configuration editing.

Use it for editing JSON strings in forms; avoid using it for general text editing or non-JSON content.

## Design Semantics

### Concepts

### Visual / UX Meaning

- Editable mode: displays a textarea with JSON editing features
- Read-only mode: displays formatted JSON text

## Canonical Examples

- Basic editable JSON editor:

  ```html
  <InkJsonEditor v-model="{}" />
  ```

- With label inside form:

  ```html
  <InkField label="Configuration">
    <InkJsonEditor v-model="{}" />
  </InkField>
  ```

- Read-only display:

  ```html
  <InkJsonEditor :editable="false" v-model='{"key": "value"}' />
  ```

- Json Schema:

  ```html
  <InkJsonEditor v-model='{"key": "value"}' schema='{"type": "object", "properties": {...}}' />
  ```

## Behavioral Contract

- Use modelValue and ensures it's a valid JSON string (If editor value is invalid, will not update to modelValue)
- Supports keyboard shortcuts: Tab/Shift+Tab for indentation, quote auto-completion, comma completion
- Supports to provide lint and autocomplete from JSON Schema.

## Extension & Composition

- Integrates with InkForm and InkField for consistent form layout
- Can be used standalone or within forms
- Supports custom layouts via `layout` prop

## Non-Goals

- General text editing (only optimized for JSON)
- Data validation beyond JSON syntax
- File upload or external JSON loading

## Implementation Notes

- Built on Code Mirror 6 and vscode-json-languageservice for advanced editing features
- Height is fixed to `rows * 1.2em + space-sm * 2` and so set `line-height: 1.2 !important`
- JSON edit features: tab indentation, quote completion, comma completion, JSON schema support (vscode-json-languageservice)

## Props

```typescript
export const inkJsonEditorProps = {
  ...formControlCommonProps,
  /** Ensured to be a valid JSON string
   */
  modelValue: makeStringProp(""),
  placeholder: makeStringProp(""),
  /**
   * the number of visible text rows, affecting the fixed height
   */
  rows: makeNumberProp(5),
  // --- JSON Schema features ---
  schema: makeObjectProp(),
  schemaUri: makeStringProp("inkcre://schema.json"),
} as const;
```

## Events

```typescript
export const inkJsonEditorEmits = {
  "update:modelValue": (value: string) => true,
} as const;
```

## Import

```typescript
import { InkJsonEditor } from '@inkcre/ui-web';
```
