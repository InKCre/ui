<script setup lang="ts">
import { inkTabsEmits, inkTabsProps } from "./inkTabs";

const props = defineProps(inkTabsProps);
const emit = defineEmits(inkTabsEmits);
function onKeydown(event: KeyboardEvent, index: number) {
  const count = props.tabs.length;
  if (!count) return;
  const next =
    event.key === "ArrowRight"
      ? (index + 1) % count
      : event.key === "ArrowLeft"
        ? (index - 1 + count) % count
        : event.key === "Home"
          ? 0
          : event.key === "End"
            ? count - 1
            : null;
  if (next === null) return;
  event.preventDefault();
  const tabs = (event.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLElement>(
    "[role=tab]",
  );
  tabs?.[next]?.focus();
  tabs?.[next]?.click();
}
</script>

<template>
  <div class="ink-tabs" role="tablist" :aria-label="label">
    <component
      :is="tab.to !== undefined && linkComponent ? linkComponent : 'button'"
      v-for="(tab, index) in tabs"
      :key="tab.value"
      class="ink-tabs__tab"
      :class="{ 'ink-tabs__tab--active': modelValue === tab.value }"
      role="tab"
      :aria-selected="modelValue === tab.value"
      :tabindex="modelValue === tab.value ? 0 : -1"
      :type="tab.to !== undefined && linkComponent ? undefined : 'button'"
      v-bind="tab.to !== undefined && linkComponent ? { to: tab.to } : {}"
      @click="emit('update:modelValue', tab.value)"
      @keydown="onKeydown($event, index)"
      >{{ tab.label }}</component
    >
  </div>
</template>

<style lang="scss" scoped src="./inkTabs.scss" />
