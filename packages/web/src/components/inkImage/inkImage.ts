import { makeStringProp, makeBooleanProp } from "../../utils/vue-props";
import type { PropType } from "vue";

// --- Types ---
export interface InkImageErrorPayload {
  error: Event;
  src: string;
}

// --- Props ---
export const inkImageProps = {
  /** Image source URL */
  src: makeStringProp(),
  /** Alternative text for accessibility */
  alt: makeStringProp(),
  /** Image title or caption */
  title: makeStringProp(""),
  /** Whether to lazy load the image */
  lazy: makeBooleanProp(true),
  /** Whether the image is expanded */
  expanded: {
    type: Boolean as PropType<boolean>,
    default: undefined,
  },
} as const;

// --- Emits ---
export const inkImageEmits = {
  /** Triggered when image is clicked to expand */
  expand: () => true,
  /** Triggered when expanded view is closed */
  close: () => true,
  /** Triggered when image fails to load */
  error: (_payload: InkImageErrorPayload) => true,
  /** Triggered when expanded state changes */
  "update:expanded": (_value: boolean) => true,
} as const;
