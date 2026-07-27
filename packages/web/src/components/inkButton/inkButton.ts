import { makeStringProp, makeBooleanProp } from "../../utils/vue-props";

// --- Types ---
type ButtonTheme = "subtle" | "primary" | "danger";
type ButtonType = "default" | "square";
type ButtonSize = "md" | "sm";

// --- Props ---
export const inkButtonProps = {
  text: makeStringProp(),
  /** iconfont class name, eg. i-mdi-menu */
  icon: makeStringProp(),
  iconPlacement: makeStringProp<"prefix" | "suffix">("prefix"),
  type: makeStringProp<ButtonType>("default"),
  theme: makeStringProp<ButtonTheme>("subtle"),
  size: makeStringProp<ButtonSize>("md"),
  isLoading: makeBooleanProp(false),
} as const;

// --- Emits ---
export const inkButtonEmits = {
  click: () => true,
} as const;
