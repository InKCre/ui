import { makeStringProp, makeBooleanProp } from "../../utils/vue-props";
import { formControlCommonProps } from "../inkForm/inkForm";

// --- Types ---
type FieldLayout = "inline" | "col" | "row";

// --- Props ---
export const inkTextareaProps = {
  ...formControlCommonProps,
  value: makeStringProp(""),
  placeholder: makeStringProp(""),
  rows: {
    type: Number,
    default: 5,
  },
} as const;

// --- Emits ---
export const inkTextareaEmits = {
  "update:value": (value: string) => true,
} as const;
