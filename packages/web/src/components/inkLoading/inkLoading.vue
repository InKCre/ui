<script setup lang="ts">
import { computed } from "vue";
import { inkLoadingProps } from "./inkLoading";

const props = defineProps(inkLoadingProps);

const loadingClass = computed(() => [
  "ink-loading",
  `ink-loading--s-${props.size}`,
  `ink-loading--d-${props.density}`,
]);
</script>

<template>
  <div :class="loadingClass">
    <div class="ink-loading__block ink-loading__block--1"></div>
    <div class="ink-loading__block ink-loading__block--2"></div>
    <div class="ink-loading__block ink-loading__block--3"></div>
  </div>
</template>

<style lang="scss" scoped src="./inkLoading.scss" />
