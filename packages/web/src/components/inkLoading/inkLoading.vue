<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { inkLoadingProps } from "./inkLoading";

const props = defineProps(inkLoadingProps);
defineOptions({ inheritAttrs: false });
const attrs = useAttrs();

const loadingClass = computed(() => [
  "ink-loading",
  `ink-loading--s-${props.size}`,
  `ink-loading--d-${props.density}`,
]);
</script>

<template>
  <div
    v-bind="attrs"
    :class="loadingClass"
    role="status"
    :aria-label="
      label || (typeof attrs['aria-label'] === 'string' ? attrs['aria-label'] : 'Loading')
    "
  >
    <span
      v-if="variant === 'spinner'"
      class="ink-loading__spinner i-mdi-loading animate-spin"
      aria-hidden="true"
    ></span>
    <span v-else class="ink-loading__blocks" aria-hidden="true">
      <span class="ink-loading__block ink-loading__block--1"></span>
      <span class="ink-loading__block ink-loading__block--2"></span>
      <span class="ink-loading__block ink-loading__block--3"></span>
    </span>
    <span v-if="label" aria-hidden="true">{{ label }}</span>
  </div>
</template>

<style lang="scss" scoped src="./inkLoading.scss" />
