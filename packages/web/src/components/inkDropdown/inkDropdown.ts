import type { PropType } from "vue";
import { makeStringProp, makeBooleanProp } from "../../utils/vue-props";
import { formControlCommonProps } from "../inkForm/inkForm";

// --- Types ---
export interface DropdownOption {
  label: string;
  value: string | number;
  description?: string;
  [key: string]: any;
}

export type DropdownOptionsSource = DropdownOption[];

// --- Props ---
export const inkDropdownProps = {
  ...formControlCommonProps,
  options: {
    type: Array as PropType<DropdownOption[]>,
  },
  refresher: {
    type: Function as PropType<() => Promise<DropdownOption[]>>,
  },
  modelValue: {
    type: [String, Number] as PropType<
      DropdownOption["value"] | undefined | null
    >,
    default: "",
  },
  placeholder: makeStringProp("Select an option"),
  displayAs: makeStringProp<"box">("box"),
  enableStepping: makeBooleanProp(false),
} as const;

// --- Emits ---
export const inkDropdownEmits = {
  "update:modelValue": (value: DropdownOption["value"]) => true,
  change: (value: DropdownOption["value"]) => true,
  "update:options": (options: DropdownOption[]) => true,
} as const;
