# InkAutoForm

# InkAutoForm

The InkAutoForm component automatically generates forms from flat JSON Schema definitions. It maps primitive types (string, number, boolean) to appropriate form controls and provides validation using `vscode-json-languageservice`.

## Rationale

InkAutoForm exists to simplify form creation by automatically generating UI controls from JSON Schema definitions, reducing boilerplate code for data input forms.

Use InkAutoForm when you have a flat JSON schema for user input and want to avoid manually wiring form controls. Do not use for complex nested schemas, arrays, or conditional logic.

## Design Semantics

### Concepts

- `Schema`: A JSON Schema object defining the structure and constraints of the form fields.
- `Form Data`: An object holding the current values of the form fields, updated in real-time.
- `Layout`: The arrangement of form fields, either inline, column, or row.

### Visual / UX Meaning

In the default state, fields display labels and inputs with placeholders. When validation fails, fields show error messages below the input, changing the border color to indicate errors. Required fields are marked with an asterisk. The layout affects spacing and flow: column stacks vertically, row aligns horizontally, inline compacts fields.

## Canonical Examples

- Basic form with string, number, and boolean fields:

  ```vue
  <script setup>
  import { ref } from "vue";
  import { InkAutoForm } from "@inkcre/ui-web";

  const schema = {
    type: "object",
    properties: {
      name: {
        type: "string",
        title: "Full Name",
        description: "Enter your name",
      },
      age: {
        type: "integer",
        title: "Age",
        minimum: 18,
      },
      subscribe: {
        type: "boolean",
        title: "Subscribe to newsletter",
      },
    },
    required: ["name"],
  };

  const formData = ref({});
  </script>

  <template>
    <InkAutoForm :schema="schema" v-model:form-data="formData" layout="col" />
  </template>
  ```

## Behavioral Contract

- Form data is validated in real-time against the schema; errors are displayed immediately below invalid fields.
- Required fields must be filled; missing values trigger validation errors.
- Default values from the schema are applied on initialization.
- State transitions (e.g., from valid to invalid) update the UI without throwing exceptions.
- No uncaught exceptions are thrown during validation or rendering.

## Extension & Composition

InkAutoForm can be composed within larger forms or used standalone. It supports v-model for two-way binding and can be integrated with form submission logic. Not recommended for high-frequency reflow containers due to dynamic field rendering.

## Non-Goals

- Handling nested objects or arrays in schemas.
- Supporting complex conditional schemas with `if`/`then`/`else`.
- Data persistence or business logic integration.
- Custom validation beyond JSON Schema constraints.

## Implementation Notes

Relies on `vscode-json-languageservice` for schema validation. Internal state managed via Vue reactivity. Assumes DOM environment for rendering; SSR support may require additional handling.

## Props

```typescript
export const inkAutoFormProps = {
  /** JSON Schema definition for the form (flat properties only) */
  schema: {
    type: Object as PropType<JSONSchema>,
    required: true,
  },
  /** Form data object */
  formData: makeObjectProp<Record<string, any>>({}),
  /** Layout for form fields */
  layout: makeStringProp<FieldLayout>("col"),
} as const;
```

## Events

```typescript
export const inkAutoFormEmits = {
  "update:formData": (value: Record<string, any>) => true,
} as const;
```

## Types

```typescript
type FieldLayout = "inline" | "col" | "row";

export interface JSONSchema {
  type: "object";
  properties: Record<string, JSONSchemaProperty>;
  required?: string[];
  [key: string]: any;
}
interface JSONSchemaProperty {
  type: "string" | "number" | "integer" | "boolean";
  title?: string;
  description?: string;
  default?: any;
  enum?: any[];
  format?: "date" | "time" | "datetime" | "date-time";
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  pattern?: string;
  [key: string]: any;
}
interface FieldComponentMapping {
  component: string;
  props: Record<string, any>;
}
```

## Import

```typescript
import { InkAutoForm } from '@inkcre/ui-web';
```
