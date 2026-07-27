import { makeStringProp, makeBooleanProp } from "../../utils/vue-props";
import type { PropType } from "vue";

// --- Types ---
export type DialogPosition =
  | "center"
  | "left"
  | "right"
  | "bottom"
  | "top"
  | [number, number, number, number]; // [top, right, bottom, left]

// --- Props ---
export const inkDialogProps = {
  modelValue: {
    type: [Boolean, Promise] as PropType<boolean | Promise<boolean>>,
    default: false,
  },
  position: {
    type: [String, Array] as PropType<DialogPosition>,
    default: "center",
  },
  closeOnScrim: makeBooleanProp(true),
  title: makeStringProp(""),
  subtitle: makeStringProp(""),
  cancelText: makeStringProp(""),
  confirmText: makeStringProp(""),
  showCancel: makeBooleanProp(true),
  showConfirm: makeBooleanProp(true),
} as const;

// --- Emits ---
export const inkDialogEmits = {
  "update:modelValue": (value: boolean) => typeof value === "boolean",
  cancel: () => true,
  confirm: () => true,
} as const;
