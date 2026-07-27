import { makeBooleanProp } from "../../utils/vue-props";

// --- Props ---
export const inkScrimProps = {
  closeOnScrim: makeBooleanProp(true),
  closeOnEscape: makeBooleanProp(true),
  showCloseButton: makeBooleanProp(false),
} as const;

// --- Emits ---
export const inkScrimEmits = {
  "scrim-click": () => true,
  close: () => true,
  "update:open": (value: boolean) => true,
} as const;
