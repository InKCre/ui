import type { Component, PropType } from "vue";

export interface InkTab {
  value: string;
  label: string;
  /** Route target understood by the consumer-provided link component. */
  to?: unknown;
}

export const inkTabsProps = {
  tabs: { type: Array as PropType<InkTab[]>, required: true },
  modelValue: { type: String, required: true },
  label: { type: String, required: true },
  linkComponent: { type: [Object, Function] as PropType<Component>, default: undefined },
} as const;

export const inkTabsEmits = {
  "update:modelValue": (_value: string) => true,
} as const;
