import { makeBooleanProp } from "../../utils/vue-props";
import type { PropType } from "vue";

// --- Types ---
export type PopupPosition =
  | "center"
  | "left"
  | "right"
  | "bottom"
  | "top"
  | [number, number, number, number]; // [top, right, bottom, left]

// --- Props ---
export const inkPopupProps = {
  position: {
    type: [String, Array] as PropType<PopupPosition>,
    default: "center",
  },
  closeOnScrim: makeBooleanProp(true),
} as const;

// --- Emits ---
export const inkPopupEmits = {
  "scrim-click": () => true,
} as const;
