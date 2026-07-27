import {
  makeStringProp,
  makeNumberProp,
  makeObjectProp,
} from "../../utils/vue-props";
import { formControlCommonProps } from "../inkForm/inkForm";

// --- Props ---
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

// --- Emits ---
export const inkJsonEditorEmits = {
  "update:modelValue": (value: string) => true,
} as const;
