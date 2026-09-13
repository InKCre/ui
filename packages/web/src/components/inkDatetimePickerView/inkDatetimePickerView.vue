<script setup lang="ts">
import { computed, ref, watch, nextTick } from "vue";
import {
  inkDatetimePickerViewProps,
  inkDatetimePickerViewEmits,
  getDaysInMonth,
  getYearRange,
  padZero,
  boundedDate,
} from "./inkDatetimePickerView";
import { useOptionalI18n } from "../../i18n";
const props = defineProps(inkDatetimePickerViewProps);
const emit = defineEmits(inkDatetimePickerViewEmits);
const i18n = useOptionalI18n();
const root = ref<HTMLElement>();
const date = computed(() => boundedDate(props.modelValue, props.minDate, props.maxDate));
// The view can mount inside a closed dialog, before native selects have a scrollable layout.
watch(
  date,
  async () => {
    await nextTick();
    for (const select of root.value?.querySelectorAll("select") ?? []) {
      const option = select.selectedOptions[0];
      if (!option) continue;
      // Scroll this column only; scrollIntoView also shifts the surrounding horizontal columns.
      select.scrollTop +=
        option.getBoundingClientRect().top -
        select.getBoundingClientRect().top -
        (select.clientHeight - option.offsetHeight) / 2;
    }
  },
  { immediate: true, flush: "post" },
);
const showDate = computed(() => props.mode.includes("date"));
const showTime = computed(() => props.mode === "time" || props.mode.includes("datetime"));
const locale = computed(() => props.locale || i18n?.locale.value || "en");
const label = (key: string, fallback: string) => (i18n ? i18n.t(`datetime.${key}`) : fallback);
const years = computed(() => {
  const values = getYearRange(props.minDate, props.maxDate);
  const year = date.value?.getFullYear();
  if (year !== undefined && !values.includes(year)) values.push(year);
  return values.sort((a, b) => a - b);
});
const months = computed(() =>
  Array.from({ length: 12 }, (_, index) =>
    new Intl.DateTimeFormat(locale.value, { month: "long" }).format(new Date(2024, index, 1)),
  ),
);
const weekdays = computed(() =>
  Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale.value, { weekday: "long" }).format(new Date(2024, 0, 7 + index)),
  ),
);
const days = computed(() =>
  date.value ? getDaysInMonth(date.value.getFullYear(), date.value.getMonth()) : 0,
);
const hours = computed(() =>
  Array.from({ length: props.hourFormat === "12" ? 12 : 24 }, (_, index) =>
    props.hourFormat === "12" ? index + 1 : index,
  ),
);
type Part = "year" | "month" | "day" | "hour" | "minute" | "period" | "weekday";
function update(part: Part, event: Event) {
  if (!date.value) return;
  const value = Number((event.target as HTMLSelectElement).value);
  const next = new Date(date.value);
  if (part === "year" || part === "month") {
    const day = next.getDate();
    next.setDate(1);
    if (part === "year") next.setFullYear(value);
    else next.setMonth(value);
    next.setDate(Math.min(day, getDaysInMonth(next.getFullYear(), next.getMonth())));
  } else if (part === "day") next.setDate(value);
  else if (part === "weekday") next.setDate(next.getDate() + value - next.getDay());
  else if (part === "hour")
    next.setHours(
      props.hourFormat === "12" ? (value % 12) + (next.getHours() >= 12 ? 12 : 0) : value,
    );
  else if (part === "minute") next.setMinutes(value);
  else next.setHours((next.getHours() % 12) + value * 12);
  const bounded = boundedDate(next, props.minDate, props.maxDate);
  if (bounded) emit("update:modelValue", bounded);
}
</script>
<template>
  <div ref="root" class="ink-datetime-picker-view">
    <p v-if="!date" role="alert">Invalid date or date range</p>
    <div v-else class="ink-datetime-picker-view__columns">
      <label v-if="mode.includes('weekday')" class="ink-datetime-picker-view__column"
        >{{ label("weekday", "Weekday") }}
        <select :value="date.getDay()" :size="5" @change="update('weekday', $event)">
          <option v-for="(day, index) in weekdays" :key="index" :value="index">{{ day }}</option>
        </select>
      </label>
      <label v-if="showDate" class="ink-datetime-picker-view__column"
        >{{ label("year", "Year") }}
        <select :value="date.getFullYear()" :size="5" @change="update('year', $event)">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </label>
      <label v-if="showDate" class="ink-datetime-picker-view__column"
        >{{ label("month", "Month") }}
        <select :value="date.getMonth()" :size="5" @change="update('month', $event)">
          <option v-for="(month, index) in months" :key="index" :value="index">{{ month }}</option>
        </select>
      </label>
      <label v-if="showDate" class="ink-datetime-picker-view__column"
        >{{ label("day", "Day") }}
        <select :value="date.getDate()" :size="5" @change="update('day', $event)">
          <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
        </select>
      </label>
      <label v-if="showTime" class="ink-datetime-picker-view__column"
        >{{ label("hour", "Hour") }}
        <select
          :value="hourFormat === '12' ? date.getHours() % 12 || 12 : date.getHours()"
          :size="5"
          @change="update('hour', $event)"
        >
          <option v-for="hour in hours" :key="hour" :value="hour">{{ padZero(hour) }}</option>
        </select>
      </label>
      <label v-if="showTime" class="ink-datetime-picker-view__column"
        >{{ label("minute", "Minute") }}
        <select :value="date.getMinutes()" :size="5" @change="update('minute', $event)">
          <option v-for="minute in 60" :key="minute" :value="minute - 1">
            {{ padZero(minute - 1) }}
          </option>
        </select>
      </label>
      <label v-if="showTime && hourFormat === '12'" class="ink-datetime-picker-view__column"
        >{{ label("period", "Period") }}
        <select :value="date.getHours() >= 12 ? 1 : 0" :size="2" @change="update('period', $event)">
          <option :value="0">AM</option>
          <option :value="1">PM</option>
        </select>
      </label>
    </div>
  </div>
</template>
<style lang="scss" scoped src="./inkDatetimePickerView.scss" />
