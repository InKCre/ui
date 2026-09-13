<script setup lang="ts">
import { computed } from "vue";
import { useAsyncBoolean } from "../../composables/use-async-boolean";
import { inkSwitchProps, inkSwitchEmits } from "./inkSwitch";

const props = defineProps(inkSwitchProps);
const emit = defineEmits(inkSwitchEmits);

const { value: currentValue, pending: isSwitchingInternal } = useAsyncBoolean(
  () => props.modelValue,
  (error) => emit("error", error),
);

const switchClass = computed(() => [
  "ink-switch",
  `ink-switch--${props.size}`,
  { "ink-switch--on": currentValue.value },
]);

const labelText = computed(() => (currentValue.value ? props.onText : props.offText));

const isSwitching = computed(() => props.isSwitching || isSwitchingInternal.value);

const handleClick = () => {
  if (!isSwitching.value && !props.disabled) {
    emit("update:modelValue", !currentValue.value);
  }
};
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="currentValue"
    :aria-label="showLabel ? labelText : undefined"
    :aria-busy="isSwitching || undefined"
    :disabled="disabled || isSwitching"
    :class="switchClass"
    @click="handleClick"
  >
    <div class="ink-switch__handle">
      <template v-if="showLabel">
        <span
          class="ink-switch__label"
          :class="{ 'ink-switch__label--hidden': !currentValue || isSwitching }"
          :aria-hidden="!currentValue || isSwitching"
          >{{ onText }}</span
        >
        <span
          class="ink-switch__label"
          :class="{ 'ink-switch__label--hidden': currentValue || isSwitching }"
          :aria-hidden="currentValue || isSwitching"
          >{{ offText }}</span
        >
      </template>
      <span
        v-if="isSwitching"
        class="ink-switch__loading i-mdi-loading animate-spin"
        aria-hidden="true"
      />
    </div>
  </button>
</template>

<style lang="scss" scoped src="./inkSwitch.scss"></style>
