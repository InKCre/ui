<script setup lang="ts">
import { computed, inject } from "vue";
import { inkButtonProps, inkButtonEmits, buttonDisabledKey } from "./inkButton";

const props = defineProps(inkButtonProps);
const emit = defineEmits(inkButtonEmits);

const inheritedDisabled = inject(buttonDisabledKey, undefined);
const isDisabled = computed(() => props.disabled || props.isLoading || inheritedDisabled?.value);

const buttonClass = computed(() => [
  "ink-button",
  `ink-button--type-${props.type}`,
  `ink-button--theme-${props.theme}`,
  `ink-button--size-${props.size}`,
  { "ink-button--loading": props.isLoading },
]);

const handleClick = (event: MouseEvent) => {
  if (!isDisabled.value) {
    emit("click", event);
  }
};
</script>

<template>
  <button
    :class="buttonClass"
    :type="nativeType"
    :disabled="isDisabled"
    :aria-busy="isLoading || undefined"
    @click="handleClick"
  >
    <slot v-if="iconPlacement === 'prefix'" name="prefix-icon">
      <span v-if="icon" :class="icon" class="ink-button__icon"></span>
    </slot>
    <slot>
      <span v-if="text">{{ text }}</span>
    </slot>
    <slot v-if="iconPlacement === 'suffix'" name="suffix-icon">
      <span v-if="icon" :class="icon" class="ink-button__icon"></span>
    </slot>
    <span
      v-if="isLoading"
      class="ink-button__loading i-mdi-loading animate-spin"
      aria-hidden="true"
    />
  </button>
</template>

<style lang="scss" scoped src="./inkButton.scss"></style>
