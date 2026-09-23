import { makeStringProp } from "../../utils/vue-props";

// --- Types ---
type LoadingSize = "xs" | "sm" | "md";
type LoadingDensity = "sm" | "md";

// --- Props ---
export const inkLoadingProps = {
  variant: makeStringProp<"blocks" | "spinner">("blocks"),
  label: makeStringProp(""),
  size: makeStringProp<LoadingSize>("md"),
  density: makeStringProp<LoadingDensity>("md"),
} as const;
