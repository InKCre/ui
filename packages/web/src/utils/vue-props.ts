import { type PropType } from "vue";

export const unknownProp = null as unknown as PropType<unknown>;

export const numericProp = [Number, String];

export const truthProp = {
  type: Boolean,
  default: true as const,
};

export const makeRequiredProp = <T>(type: T) => ({
  type,
  required: true as const,
});

export const makeArrayProp = <T>(defaultVal: T[] = []) => ({
  type: Array as PropType<T[]>,
  default: () => defaultVal,
});

export const makeBooleanProp = <T>(defaultVal: T) => ({
  type: Boolean,
  default: defaultVal,
});

export const makeNumberProp = <T>(defaultVal: T) => ({
  type: Number,
  default: defaultVal,
});

export const makeNumericProp = <T>(defaultVal: T) => ({
  type: numericProp,
  default: defaultVal,
});

export const makeStringProp = <T = string>(defaultVal?: T) => ({
  type: String as unknown as PropType<T>,
  default: defaultVal,
});

export const makeObjectProp = <T = object>(defaultVal?: T) => ({
  type: Object as PropType<T>,
  default: () => defaultVal,
});

export { useOptionalModel as useOptionalVModel } from "../composables/use-optional-model";

/**
 * XOR type
 *
 * Used to create mutually exclusive types
 * e.g. a type that can be either A or B, but not both
 */
export type XOR<A, B> = (A & { [K in keyof B]?: never }) | (B & { [K in keyof A]?: never });
