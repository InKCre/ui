import { makeStringProp, makeNumberProp, makeObjectProp } from "../../utils/vue-props";
import { formControlCommonProps } from "../inkForm/inkForm";

import type { JsonEditorValidation } from "./jsonSchemaService";
import type { JSONSchema } from "vscode-json-languageservice";

// --- Props ---
export const inkJsonEditorProps = {
  ...formControlCommonProps,
  /** Raw editor text, including incomplete or invalid JSON. */
  modelValue: makeStringProp(""),
  placeholder: makeStringProp(""),
  /**
   * the number of visible text rows, affecting the fixed height
   */
  rows: makeNumberProp(5),
  // --- JSON Schema features ---
  schema: makeObjectProp<JSONSchema>(),
  schemaUri: makeStringProp("inkcre://schema.json"),
} as const;

// --- Emits ---
export const inkJsonEditorEmits = {
  validation: (_result: JsonEditorValidation) => true,
  error: (_error: unknown) => true,
  "update:modelValue": (_value: string) => true,
} as const;
