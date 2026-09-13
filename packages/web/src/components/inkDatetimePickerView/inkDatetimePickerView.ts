import type { PropType } from "vue";
import { makeStringProp } from "../../utils/vue-props";

// --- Types ---
export type InkDatetimePickerMode =
  | "date"
  | "time"
  | "datetime"
  | "weekday"
  | "weekday-date"
  | "weekday-datetime";

export type HourFormat = "12" | "24";

export interface PickerColumn {
  values: (string | number)[];
  defaultIndex: number;
}

// --- Constants ---
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// --- Props ---
export const inkDatetimePickerViewProps = {
  modelValue: {
    type: Date as PropType<Date>,
    default: () => new Date(),
  },
  locale: makeStringProp(),
  mode: makeStringProp<InkDatetimePickerMode>("datetime"),
  minDate: {
    type: Date as PropType<Date>,
    default: undefined,
  },
  maxDate: {
    type: Date as PropType<Date>,
    default: undefined,
  },
  hourFormat: makeStringProp<HourFormat>("24"),
} as const;

// --- Emits ---
export const inkDatetimePickerViewEmits = {
  "update:modelValue": (value: Date) => value instanceof Date,
} as const;

// --- Utilities ---
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getYearRange(minDate?: Date, maxDate?: Date): number[] {
  const currentYear = new Date().getFullYear();
  const minYear = minDate ? minDate.getFullYear() : currentYear - 100;
  const maxYear = maxDate ? maxDate.getFullYear() : currentYear + 100;

  const years: number[] = [];
  for (let year = minYear; year <= maxYear; year++) {
    years.push(year);
  }
  return years;
}

export function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

export function formatHour(hour: number, format: HourFormat): string {
  if (format === "12") {
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return padZero(displayHour);
  }
  return padZero(hour);
}

export function getAmPm(hour: number): string {
  return hour < 12 ? "AM" : "PM";
}

/** Clone and clamp a valid Date without changing the caller's object. */
export function boundedDate(value: unknown, min?: Date, max?: Date): Date | null {
  const valid = (date: unknown): date is Date =>
    date instanceof Date && Number.isFinite(date.getTime());
  if (!valid(value) || (min !== undefined && !valid(min)) || (max !== undefined && !valid(max)))
    return null;
  if (min && max && min > max) return null;
  return new Date(
    Math.min(max?.getTime() ?? Infinity, Math.max(min?.getTime() ?? -Infinity, value.getTime())),
  );
}
