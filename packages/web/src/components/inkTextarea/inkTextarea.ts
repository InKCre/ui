import { makeStringProp } from "../../utils/vue-props";
import { formControlCommonProps } from "../inkForm/inkForm";

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
  "update:value": (_value: string) => true,
} as const;
