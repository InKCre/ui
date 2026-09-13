<script setup lang="ts" generic="T">
import { computed, ref, watch } from "vue";
import { createReusableTemplate } from "@vueuse/core";
import { inkPickerProps, inkPickerEmits } from "./inkPicker";
import InkDatetimePickerView from "../inkDatetimePickerView/inkDatetimePickerView.vue";
import { boundedDate } from "../inkDatetimePickerView/inkDatetimePickerView";
import InkField from "../inkField/inkField.vue";
import InkPopup from "../inkPopup/inkPopup.vue";
import InkButton from "../inkButton/inkButton.vue";
import { useFieldControl } from "../../composables/use-field-control";
import { useOptionalVModel } from "../../utils/vue-props";
import { useOptionalI18n } from "../../i18n";

defineOptions({ inheritAttrs: false });
const props = defineProps(inkPickerProps<T>());
const emit = defineEmits(inkPickerEmits<T>());
const { controlId, errorId, describedBy, fieldLayout, useField } = useFieldControl(props);
const i18n = useOptionalI18n();
const draft = ref<Date | null>(null);
const showPopup = useOptionalVModel<boolean>({
  props,
  emit,
  modelName: "showPopup",
  defaultValue: false,
});
const displayValue = computed(() => {
  if (props.modelValue == null) return "";
  if (props.formatter) return props.formatter(props.modelValue as T);
  if (!props.type) return String(props.modelValue);
  const date = boundedDate(props.modelValue);
  if (!date) return "Invalid date";
  if (props.type === "date") return date.toLocaleDateString();
  if (props.type === "time") return date.toLocaleTimeString();
  return date.toLocaleString();
});
// Reopening or replacing the external value starts a fresh draft. Cancel never commits it.
watch(
  [showPopup, () => props.modelValue, () => props.minDate, () => props.maxDate],
  () => {
    if (showPopup.value && props.type)
      draft.value = boundedDate(props.modelValue ?? new Date(), props.minDate, props.maxDate);
  },
  { immediate: true },
);
function onPickClick() {
  if (props.editable && !props.disabled) {
    showPopup.value = true;
    emit("pick");
  }
}
function closePopup() {
  showPopup.value = false;
}
function onConfirm() {
  if (!draft.value || props.disabled || !props.editable) return;
  emit("update:modelValue", new Date(draft.value) as T);
  closePopup();
}
const [DefinePicker, ReusePicker] = createReusableTemplate();
</script>
<template>
  <DefinePicker>
    <button
      v-bind="$attrs"
      :id="controlId"
      type="button"
      :disabled="disabled || !editable"
      :aria-expanded="showPopup"
      aria-haspopup="dialog"
      :aria-describedby="describedBy"
      :aria-invalid="!!error || undefined"
      :class="[
        'ink-picker',
        `ink-picker--${displayValueAs}`,
        { editable: editable && !disabled, 'ink-picker--active': showPopup },
      ]"
      @click="onPickClick"
    >
      <span class="ink-picker__value">{{ displayValue || "—" }}</span
      ><span
        v-if="editable && displayValueAs === 'box'"
        class="i-mdi-chevron-right ink-picker__icon"
      />
    </button>
  </DefinePicker>
  <InkField
    v-if="useField"
    :for="controlId"
    :label="label || ''"
    :layout="fieldLayout"
    :required="required"
    :error="error"
    :error-id="errorId"
    ><ReusePicker
  /></InkField>
  <ReusePicker v-else />
  <InkPopup v-model:open="showPopup" position="center" :aria-label="label || 'Choose value'">
    <slot v-if="!props.type" :closePopup="closePopup" :modelValue="modelValue" />
    <template v-else>
      <InkDatetimePickerView
        v-if="draft"
        v-model="draft"
        :mode="type"
        :min-date="minDate"
        :max-date="maxDate"
      />
      <p v-else role="alert">Invalid date or date range</p>
      <div class="ink-picker-popup__actions">
        <InkButton :text="i18n ? i18n.t('dialog.cancel') : 'Cancel'" @click="closePopup" />
        <InkButton
          :text="i18n ? i18n.t('dialog.confirm') : 'Confirm'"
          theme="primary"
          :disabled="!draft || disabled || !editable"
          @click="onConfirm"
        />
      </div>
    </template>
  </InkPopup>
</template>
<style lang="scss" scoped src="./inkPicker.scss" />
