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
  $defs?: Record<string, JSONSchemaProperty>;
  [key: string]: unknown;
}

export interface JSONSchemaProperty {
  type?:
    | "string"
    | "number"
    | "integer"
    | "boolean"
    | "object"
    | "array"
    | "null"
    | Array<"string" | "number" | "integer" | "boolean" | "object" | "array" | "null">;
  $ref?: string;
  anyOf?: JSONSchemaProperty[];
  properties?: Record<string, JSONSchemaProperty>;
  required?: string[];
  items?: JSONSchemaProperty;
  title?: string;
  description?: string;
  default?: unknown;
  enum?: unknown[];
  format?: "date" | "time" | "datetime" | "date-time" | "password";
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  pattern?: string;
  [key: string]: unknown;
}

export interface FieldComponentMapping {
  component: string;
  props: Record<string, any>;
}

// --- Props ---
export const inkAutoFormProps = {
  /** JSON Schema definition for the form. */
  schema: {
    type: Object as PropType<JSONSchema>,
    required: true,
  },
  /** Form data object */
  formData: makeObjectProp<Record<string, any>>({}),
  /** Layout for form fields */
  layout: makeStringProp<FieldLayout>("col"),
  /** Render fields without a form element when embedded in an existing form. */
  embedded: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
} as const;

/** Resolve only local definitions; unsupported or cyclic schemas must use a JSON editor. */
export function resolveFormSchema(
  property: JSONSchemaProperty,
  root: JSONSchema,
  visited: ReadonlySet<string> = new Set(),
): JSONSchemaProperty | null {
  if (typeof property.$ref !== "undefined" && typeof property.$ref !== "string") return null;
  if (property.$ref) {
    const prefix = "#/$defs/";
    if (!property.$ref.startsWith(prefix) || visited.has(property.$ref)) return null;
    const name = property.$ref.slice(prefix.length).replace(/~1/g, "/").replace(/~0/g, "~");
    const target = root.$defs?.[name];
    return target && typeof target === "object" && !Array.isArray(target)
      ? resolveFormSchema(target, root, new Set([...visited, property.$ref]))
      : null;
  }
  if (property.anyOf) {
    if (
      !Array.isArray(property.anyOf) ||
      property.anyOf.some(
        (branch) => !branch || typeof branch !== "object" || Array.isArray(branch),
      )
    )
      return null;
    // Zod represents an optional URL as the empty literal or a URL string.
    if (
      property.anyOf.length === 2 &&
      property.anyOf.some((branch) => branch.const === "") &&
      property.anyOf.some((branch) => branch.type === "string" && branch.const === undefined)
    ) {
      const editable = property.anyOf.find(
        (branch) => branch.type === "string" && branch.const === undefined,
      )!;
      return {
        ...editable,
        title: property.title ?? editable.title,
        default: property.default ?? editable.default,
      };
    }
    const nonNull = property.anyOf.filter((branch) => branch.type !== "null");
    if (nonNull.length !== 1 || nonNull.length === property.anyOf.length) return null;
    const resolved = resolveFormSchema(nonNull[0], root, visited);
    return resolved
      ? { ...resolved, title: property.title ?? resolved.title, nullable: true }
      : null;
  }
  if (Array.isArray(property.type)) {
    const nonNull = property.type.filter((type) => type !== "null");
    return nonNull.length === 1 && nonNull.length !== property.type.length
      ? { ...property, type: nonNull[0], nullable: true }
      : null;
  }
  return property;
}

export function canRenderJsonSchema(schema: unknown): schema is JSONSchema {
  if (!schema || typeof schema !== "object") return false;
  const root = schema as JSONSchema;
  if (
    root.type !== "object" ||
    !root.properties ||
    typeof root.properties !== "object" ||
    Array.isArray(root.properties)
  )
    return false;
  if (Object.keys(root.properties).length === 0) return false;
  function supported(raw: unknown, depth: number): boolean {
    if (depth > 16 || !raw || typeof raw !== "object" || Array.isArray(raw)) return false;
    const property = resolveFormSchema(raw as JSONSchemaProperty, root);
    if (!property) return false;
    if (
      ["oneOf", "allOf", "if", "then", "else", "patternProperties"].some((key) => key in property)
    )
      return false;
    if (property.type === "object")
      return (
        !!property.properties &&
        !Array.isArray(property.properties) &&
        Object.values(property.properties).every((child) => supported(child, depth + 1))
      );
    if (property.type === "array") return !!property.items && supported(property.items, depth + 1);
    return ["string", "number", "integer", "boolean"].includes(String(property.type));
  }
  if (["oneOf", "allOf", "if", "then", "else", "patternProperties"].some((key) => key in root))
    return false;
  return Object.values(root.properties).every((property) => supported(property, 0));
}

export function initialFormValue(raw: JSONSchemaProperty, root: JSONSchema): unknown {
  const property = resolveFormSchema(raw, root);
  if (!property) return undefined;
  if (property.default !== undefined) return property.default;
  if (property.type === "object")
    return Object.fromEntries(
      Object.entries(property.properties ?? {})
        .map(([key, child]) => [key, initialFormValue(child, root)])
        .filter(([, value]) => value !== undefined),
    );
  if (property.type === "array") return [];
  if (property.type === "boolean") return false;
  if (property.type === "string") return "";
  return undefined;
}

/** Readable fallback for schemas that do not provide a title. */
export function schemaFieldLabel(key: string): string {
  const words = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) =>
      ["ai", "api", "http", "id", "llm", "url"].includes(word.toLowerCase())
        ? word.toUpperCase()
        : word,
    );
  if (!words.length) return key;
  return words.join(" ").replace(/^./, (letter) => letter.toUpperCase());
}

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

  if (type === "string" && format === "password") {
    return { component: "inkInput", props: { nativeType: "password" } };
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
