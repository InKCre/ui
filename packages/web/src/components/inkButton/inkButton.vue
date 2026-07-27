<script setup lang="ts">
import { computed, inject, type ComputedRef } from "vue";
import { inkButtonProps, inkButtonEmits } from "./inkButton";

const props = defineProps(inkButtonProps);
const emit = defineEmits(inkButtonEmits);

const injectedIsLoading = inject<ComputedRef<boolean> | boolean>(
  "isLoading",
  false
);

const isLoading = computed(() => {
  if (typeof injectedIsLoading === "boolean") {
    return props.isLoading || injectedIsLoading;
  }
  return props.isLoading || injectedIsLoading.value;
});

const buttonClass = computed(() => [
  "ink-button",
  `ink-button--type-${props.type}`,
  `ink-button--theme-${props.theme}`,
  `ink-button--size-${props.size}`,
  { "ink-button--loading": isLoading.value },
]);

const handleClick = () => {
  if (!isLoading.value) {
    emit("click");
  }
};
</script>

<template>
  <button :class="buttonClass" :disabled="isLoading" @click="handleClick">
    <slot v-if="iconPlacement === 'prefix'" name="prefix-icon">
      <span v-if="icon" :class="icon" class="ink-button__icon"></span>
    </slot>
    <slot>
      <span v-if="text">{{ text }}</span>
    </slot>
    <slot v-if="iconPlacement === 'suffix'" name="suffix-icon">
      <span v-if="icon" :class="icon" class="ink-button__icon"></span>
    </slot>
    <div v-if="isLoading" class="ink-button__loading-overlay">
      <span class="i-mdi-loading animate-spin" />
    </div>
  </button>
</template>

<style lang="scss" scoped src="./inkButton.scss"></style>
