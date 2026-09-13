import { makeStringProp, makeBooleanProp } from "../../utils/vue-props";
import { formControlCommonProps } from "../inkForm/inkForm";
import type { PropType } from "vue";

// --- Types ---
type DisplayValueAs = "inline-text" | "box";
type InkPickerType = "date" | "time" | "datetime";

// --- Props ---
export const inkPickerProps = <T>() =>
  ({
    ...formControlCommonProps,
    modelValue: {
      type: [String, Object, Date] as PropType<T>,
    },
    minDate: { type: Date },
    maxDate: { type: Date },
    type: makeStringProp<InkPickerType>(),
    displayValueAs: makeStringProp<DisplayValueAs>("inline-text"),
    formatter: {
      type: Function as PropType<(value: T) => string>,
    },
    showPopup: makeBooleanProp<boolean | undefined>(undefined),
  }) as const;

// --- Emits ---
export const inkPickerEmits = <T>() =>
  ({
    pick: () => true,
    "update:modelValue": (_value: T) => true,
    "update:showPopup": (_value: boolean) => true,
  }) as const;
