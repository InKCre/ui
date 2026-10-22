<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { createReusableTemplate } from "@vueuse/core";
import { inkInputProps, inkInputEmits } from "./inkInput";
import InkField from "../inkField/inkField.vue";
import InkButton from "../inkButton/inkButton.vue";
import { useFieldControl } from "../../composables/use-field-control";

defineOptions({ inheritAttrs: false });
const props = defineProps(inkInputProps);
const emit = defineEmits(inkInputEmits);
const { controlId, errorId, describedBy, fieldLayout, useField } = useFieldControl(props);
const isInlineEditing = ref(false);
const input = ref<HTMLInputElement>();
const trigger = ref<HTMLButtonElement>();
const draft = ref("");
const showPassword = ref(false);

// Password toggle logic
const isPasswordField = computed(() => props.nativeType === "password");
const shouldShowToggle = computed(
  () => isPasswordField.value && props.showPasswordToggle && props.type !== "inline",
);
const effectiveType = computed(() => {
  if (isPasswordField.value && showPassword.value) return "text";
  return props.nativeType;
});
const passwordToggleIcon = computed(() => (showPassword.value ? "i-mdi-eye-off" : "i-mdi-eye"));
const passwordToggleLabel = computed(() =>
  showPassword.value ? "Hide password" : "Show password",
);

async function startEditing() {
  if (!props.editable || props.disabled) return;
  draft.value = props.modelValue ?? "";
  isInlineEditing.value = true;
  await nextTick();
  input.value?.focus();
}
async function finishEditing(event: KeyboardEvent) {
  if (event.isComposing || event.keyCode === 229) return;
  if (event.key !== "Enter" && event.key !== "Escape") return;
  event.preventDefault();
  event.stopPropagation();
  if (event.key === "Enter") {
    const value = (event.target as HTMLInputElement).value;
    emit("update:modelValue", value);
    emit("confirm", value);
  } else emit("cancel");
  isInlineEditing.value = false;
  await nextTick();
  trigger.value?.focus();
}
function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  if (props.type === "inline") draft.value = value;
  else emit("update:modelValue", value);
}
function onBlur() {
  if (!isInlineEditing.value) return;
  isInlineEditing.value = false;
  emit("cancel");
}
function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}
const [DefineInput, ReuseInput] = createReusableTemplate();
</script>

<template>
  <DefineInput>
    <div
      class="ink-input"
      :class="{
        'ink-input--inline': type === 'inline',
        'ink-input--inline-editing': isInlineEditing,
        'ink-input--with-password-toggle': shouldShowToggle,
      }"
    >
      <input
        v-if="editable && (type !== 'inline' || isInlineEditing)"
        v-bind="$attrs"
        :id="controlId"
        ref="input"
        class="ink-input__input"
        :type="effectiveType"
        :name="name"
        :disabled="disabled"
        :required="required"
        :aria-invalid="!!error || undefined"
        :aria-describedby="describedBy"
        :value="type === 'inline' ? draft : modelValue"
        :placeholder="placeholder"
        @input="onInput"
        @keydown="type === 'inline' && finishEditing($event)"
        @blur="onBlur"
      />
      <InkButton
        v-if="shouldShowToggle"
        native-type="button"
        theme="subtle"
        size="sm"
        :icon="passwordToggleIcon"
        :aria-label="passwordToggleLabel"
        :aria-pressed="showPassword"
        class="ink-input__password-toggle"
        @click="togglePasswordVisibility"
      />
      <button
        v-else-if="type === 'inline' && editable && !isInlineEditing"
        v-bind="$attrs"
        :id="controlId"
        ref="trigger"
        type="button"
        class="ink-input__inline-text"
        :disabled="disabled"
        :aria-describedby="describedBy"
        @click="startEditing"
      >
        <slot>{{ modelValue || placeholder }}</slot>
      </button>
      <span v-else-if="type !== 'inline' || !editable" :id="controlId" class="ink-input__value">{{
        modelValue
      }}</span>
    </div>
  </DefineInput>
  <InkField
    v-if="useField"
    :for="controlId"
    :label="label || ''"
    :layout="fieldLayout"
    :required="required"
    :error="error"
    :error-id="errorId"
    ><ReuseInput
  /></InkField>
  <ReuseInput v-else />
</template>
<style lang="scss" scoped src="./inkInput.scss" />
