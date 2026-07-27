import { makeStringProp } from "../../utils/vue-props";

// --- Types ---
type PlaceholderState = "empty" | "error";

// --- Props ---
export const inkPlaceholderProps = {
  /** The state of the placeholder */
  state: makeStringProp<PlaceholderState>("empty"),
  /** The illustration to display (icon class name or custom content via slot) */
  illustration: makeStringProp<string>(""),
  /** The title text */
  title: makeStringProp<string>(""),
  /** The description text */
  description: makeStringProp<string>(""),
} as const;
