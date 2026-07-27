import { makeStringProp } from "../../utils/vue-props";
import { formControlCommonProps } from "../inkForm/inkForm";

// --- Types ---
export type InkInputType = "default" | "inline";

// --- Props ---
export const inkInputProps = {
  ...formControlCommonProps,
  modelValue: makeStringProp<string | null>(""),
  placeholder: makeStringProp(""),
  type: makeStringProp<InkInputType>("default"),
} as const;

// --- Emits ---
export const inkInputEmits = {
  "update:modelValue": (value: string) => true,
} as const;
