<script setup lang="ts">
import { ref, computed, useId } from "vue";
import { inkTooltipProps, inkTooltipEmits } from "./inkTooltip";

const props = defineProps(inkTooltipProps);
const emit = defineEmits(inkTooltipEmits);

const hovered = ref(false);
const focused = ref(false);
const dismissed = ref(false);
const showTooltip = computed(() => !dismissed.value && (hovered.value || focused.value));
const tooltipId = useId();

const tooltipClass = computed(() => [
  "ink-tooltip",
  `ink-tooltip--${props.position}`,
  {
    "ink-tooltip--visible": showTooltip.value,
  },
]);
</script>

<template>
  <div
    class="ink-tooltip-wrapper"
    @mouseenter="
      hovered = true;
      dismissed = false;
    "
    @mouseleave="hovered = false"
    @focusin="
      focused = true;
      dismissed = false;
    "
    @focusout="focused = false"
    @keydown.esc.stop="dismissed = true"
  >
    <slot :describedby="content ? tooltipId : undefined" />

    <div
      v-if="content"
      :id="tooltipId"
      role="tooltip"
      :aria-hidden="!showTooltip"
      :class="tooltipClass"
    >
      <div class="ink-tooltip__content">
        {{ content }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./inkTooltip.scss"></style>
