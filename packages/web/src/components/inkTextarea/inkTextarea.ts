import { makeStringProp, makeBooleanProp } from "../../utils/vue-props";
import { formControlCommonProps } from "../inkForm/inkForm";

// --- Props ---
export const inkTextareaProps = {
  ...formControlCommonProps,
  value: makeStringProp(""),
  /** Use the system monospace family for code or other fixed-width content. */
  mono: makeBooleanProp(false),
  placeholder: makeStringProp(""),
  rows: {
    type: Number,
    default: 5,
  },
} as const;

// --- Emits ---
export const inkTextareaEmits = {
  "update:value": (_value: string) => true,
} as const;
