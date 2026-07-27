import type { PropType } from "vue";
import { makeStringProp, makeObjectProp } from "../../utils/vue-props";

// --- Types ---
export type FieldLayout = "inline" | "col" | "row";

export interface JSONSchema {
  type: "object";
  properties: Record<string, JSONSchemaProperty>;
  required?: string[];
  [key: string]: any;
}

export interface JSONSchemaProperty {
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

export interface FieldComponentMapping {
  component: string;
  props: Record<string, any>;
}

// --- Props ---
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

// --- Emits ---
export const inkAutoFormEmits = {
  "update:formData": (value: Record<string, any>) => true,
} as const;

// --- Utilities ---

/**
 * Maps JSON Schema property to appropriate form control component
 */
export function mapSchemaPropertyToComponent(
  property: JSONSchemaProperty
): FieldComponentMapping {
  const { type, enum: enumValues, format, maxLength } = property;

  // Boolean -> Switch
  if (type === "boolean") {
    return {
      component: "inkSwitch",
      props: {},
    };
  }

  // String with enum -> Dropdown
  if (type === "string" && enumValues && enumValues.length > 0) {
    return {
      component: "inkDropdown",
      props: {
        options: enumValues.map((val) => ({
          label: String(val),
          value: val,
        })),
      },
    };
  }

  // String with date/time format -> Picker
  if (type === "string" && format) {
    const pickerType =
      format === "date-time" ? "datetime" : format === "time" ? "time" : "date";
    return {
      component: "inkPicker",
      props: {
        type: pickerType,
      },
    };
  }

  // String with long maxLength -> Textarea
  if (type === "string" && maxLength && maxLength > 100) {
    return {
      component: "inkTextarea",
      props: {
        rows: 3,
      },
    };
  }

  // Number/Integer -> Input (fallback to text for now)
  if (type === "number" || type === "integer") {
    return {
      component: "inkInput",
      props: {
        type: "default",
      },
    };
  }

  // Default String -> Input
  return {
    component: "inkInput",
    props: {
      type: "default",
    },
  };
}

/**
 * Validates form data against JSON Schema
 */
export async function validateFormData(
  formData: Record<string, any>,
  schema: JSONSchema,
  jsonService: any
): Promise<{ valid: boolean; errors: Record<string, string[]> }> {
  try {
    const jsonString = JSON.stringify(formData, null, 2);
    const TextDocument = await import("vscode-json-languageservice").then(
      (m) => m.TextDocument
    );

    const doc = TextDocument.create(
      "autoform://form-data.json",
      "json",
      0,
      jsonString
    );
    const jsonDocument = jsonService.parseJSONDocument(doc);

    // Configure schema
    jsonService.resetSchema("autoform://form-data.json");
    jsonService.configure({
      schemas: [
        {
          uri: "autoform://schema.json",
          fileMatch: ["autoform://form-data.json"],
          schema,
        },
      ],
    });

    const diagnostics = await jsonService.doValidation(doc, jsonDocument);

    const errors: Record<string, string[]> = {};

    diagnostics.forEach((d: any) => {
      // Extract property name from message or path
      const message = d.message;
      const match = message.match(/Property (\w+)/);
      const propertyName = match ? match[1] : "root";

      if (!errors[propertyName]) {
        errors[propertyName] = [];
      }
      errors[propertyName].push(message);
    });

    return {
      valid: diagnostics.length === 0,
      errors,
    };
  } catch (error) {
    console.warn("[InkAutoForm] Validation error:", error);
    return {
      valid: true,
      errors: {},
    };
  }
}
