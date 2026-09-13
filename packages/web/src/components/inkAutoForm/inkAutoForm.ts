import type { PropType } from "vue";
import { TextDocument } from "vscode-languageserver-textdocument";
import type { LanguageService } from "vscode-json-languageservice";
import { SCHEMA_RESOLVE_ERROR } from "../inkJsonEditor/jsonSchemaService";
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
  validation: (_result: FormValidation) => true,
  error: (_error: unknown) => true,
  "update:formData": (_value: Record<string, any>) => true,
} as const;

// --- Utilities ---

/**
 * Maps JSON Schema property to appropriate form control component
 */
export function mapSchemaPropertyToComponent(property: JSONSchemaProperty): FieldComponentMapping {
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
  if (type === "string" && format && ["date", "time", "date-time", "datetime"].includes(format)) {
    const pickerType =
      format === "date-time" || format === "datetime"
        ? "datetime"
        : format === "time"
          ? "time"
          : "date";
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

  // Numeric controls emit text; AutoForm converts complete finite numbers at its data boundary.
  if (type === "number" || type === "integer") {
    return {
      component: "inkInput",
      props: {
        nativeType: "text",
        inputmode: type === "integer" ? "numeric" : "decimal",
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

export interface FormValidation {
  valid: boolean;
  status: "pending" | "valid" | "invalid" | "error";
  errors: Record<string, string[]>;
  rootErrors: string[];
}

/** Validation failures reject; the component reports an unavailable validator as an error. */
export async function validateFormData(
  formData: Record<string, unknown>,
  service: LanguageService,
): Promise<FormValidation> {
  const doc = TextDocument.create(
    "autoform://form-data.json",
    "json",
    0,
    JSON.stringify(formData, null, 2),
  );
  const jsonDocument = service.parseJSONDocument(doc);
  const diagnostics = await service.doValidation(doc, jsonDocument);
  const errors: Record<string, string[]> = Object.create(null);
  const rootErrors: string[] = [];
  for (const diagnostic of diagnostics) {
    let node = jsonDocument.getNodeFromOffset(doc.offsetAt(diagnostic.range.start));
    while (node?.parent && node.parent !== jsonDocument.root) node = node.parent;
    if (node?.type === "property") (errors[node.keyNode.value] ??= []).push(diagnostic.message);
    else rootErrors.push(diagnostic.message);
  }
  return {
    valid: diagnostics.length === 0,
    status: diagnostics.some((item) => item.code === SCHEMA_RESOLVE_ERROR)
      ? "error"
      : diagnostics.length
        ? "invalid"
        : "valid",
    errors,
    rootErrors,
  };
}

/** JSON Schema date strings stay strings in formData. Picker alone uses local Date objects. */
export function parseFieldDate(value: unknown, format?: string): Date | null {
  if (typeof value !== "string" || !value) return null;
  if (format === "date") {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return null;
    const date = new Date(0);
    date.setFullYear(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    date.setHours(0, 0, 0, 0);
    return date.getFullYear() === Number(match[1]) &&
      date.getMonth() === Number(match[2]) - 1 &&
      date.getDate() === Number(match[3])
      ? date
      : null;
  }
  const date = new Date(format === "time" ? `1970-01-01T${value}` : value);
  return Number.isFinite(date.getTime()) ? date : null;
}
export function serializeFieldDate(value: Date, format?: string): string {
  if (format === "date")
    return `${String(value.getFullYear()).padStart(4, "0")}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
  if (format === "time") return value.toISOString().slice(11);
  return value.toISOString();
}
