<script setup lang="ts" generic="T">
import { computed, inject } from "vue";
import { createReusableTemplate } from "@vueuse/core";
import { inkPickerProps, inkPickerEmits } from "./inkPicker";
import InkDatetimePickerView from "../inkDatetimePickerView/inkDatetimePickerView.vue";
import InkField from "../inkField/inkField.vue";
import InkPopup from "../inkPopup/inkPopup.vue";
import InkButton from "../inkButton/inkButton.vue";
import { INK_FORM_CONTEXT_KEY } from "../inkForm/inkForm";
import { useOptionalVModel } from "../../utils/vue-props";

const props = defineProps(inkPickerProps<T>());
const emit = defineEmits(inkPickerEmits<T>());

const formContext = inject(INK_FORM_CONTEXT_KEY, null);

const useField = computed(() => formContext !== null && props.label);
const fieldLayout = computed(() => props.layout || formContext?.layout);

const displayValue = computed(() => {
  if (props.formatter) return props.formatter(props.modelValue as T);
  if (!props.type) return String(props.modelValue);
  const date = props.modelValue as Date;
  if (props.type === "date") return date.toLocaleDateString();
  if (props.type === "time") return date.toLocaleTimeString();
  if (props.type === "datetime") return date.toLocaleString();
  return "";
});

const showPopup = useOptionalVModel({
  props,
  emit,
  modelName: "showPopup",
  defaultValue: false,
});

const onPickClick = () => {
  if (props.editable) {
    showPopup.value = true;
    emit("pick");
  }
};

const onConfirm = () => {
  showPopup.value = false;
};

const onCancel = () => {
  showPopup.value = false;
};

const closePopup = () => {
  showPopup.value = false;
};

const [DefinePicker, ReusePicker] =
  createReusableTemplate<Record<string, never>>();
</script>

<template>
  <DefinePicker>
    <div
      v-if="displayValueAs === 'box'"
      :class="[
        'ink-picker',
        'ink-picker--box',
        { editable, 'ink-picker--active': showPopup },
      ]"
      @click="onPickClick"
    >
      <span class="ink-picker__value">{{ displayValue }}</span>
      <span v-if="editable" class="i-mdi-chevron-right ink-picker__icon"></span>
    </div>

    <span
      v-else-if="displayValueAs === 'inline-text'"
      :class="[
        'ink-picker',
        'ink-picker__value',
        'ink-picker--inline-text',
        { editable },
      ]"
      @click="onPickClick"
    >
      {{ displayValue }}
    </span>
  </DefinePicker>

  <InkField
    v-if="useField"
    :label="label"
    :layout="fieldLayout"
    :required="required"
  >
    <ReusePicker />
  </InkField>

  <template v-else>
    <ReusePicker />
  </template>

  <!-- TODO wrap with popup -->
  <InkPopup v-model:open="showPopup" position="center">
    <slot
      v-if="!props.type"
      :closePopup="closePopup"
      :modelValue="modelValue"
    />
    <template v-else>
      <InkDatetimePickerView
        v-if="['date', 'time', 'datetime', 'weekday'].includes(type)"
        :modelValue="props.modelValue as Date"
        @update:modelValue="emit('update:modelValue', $event as T)"
        :mode="type"
      />
      <div class="ink-picker-popup__actions">
        <InkButton text="Cancel" theme="subtle" @click="onCancel" />
        <InkButton text="Confirm" theme="primary" @click="onConfirm" />
      </div>
    </template>
  </InkPopup>
</template>

<style lang="scss" scoped src="./inkPicker.scss" />
