import { makeStringProp } from "../../utils/vue-props";
import { formControlCommonProps } from "../inkForm/inkForm";

// --- Types ---
export type InkInputType = "default" | "inline";

// --- Props ---
export const inkInputProps = {
  ...formControlCommonProps,
  modelValue: makeStringProp<string | null>(""),
  nativeType: makeStringProp("text"),
  placeholder: makeStringProp(""),
  type: makeStringProp<InkInputType>("default"),
} as const;

// --- Emits ---
export const inkInputEmits = {
  confirm: (_value: string) => true,
  cancel: () => true,
  "update:modelValue": (_value: string) => true,
} as const;
