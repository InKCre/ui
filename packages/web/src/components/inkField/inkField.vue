<script setup lang="ts">
import { computed } from "vue";
import { inkFieldProps, inkFieldEmits } from "./inkField";

const props = defineProps(inkFieldProps);
const emit = defineEmits(inkFieldEmits);

const fieldClass = computed(() => ["ink-field", `ink-field--${props.layout}`]);

const valueClass = computed(() => [
  "ink-field__value",
  {
    "ink-field__value--underlined": props.layout === "inline" && props.editable,
    "ink-field__value--clickable": props.editable,
  },
]);

const onValueClick = () => {
  emit("value-click");
};
</script>

<template>
  <div :class="fieldClass">
    <div class="flex flex-row">
      <label :for="props.for" class="ink-field__label">
        {{ label }}
        <sup aria-hidden="true" v-if="props.required" class="ink-field__required">*</sup>
      </label>
      <slot name="label-right" />
    </div>
    <slot>
      <button v-if="editable" type="button" :class="valueClass" @click="onValueClick">
        {{ value }}
      </button>
      <span v-else :class="valueClass">{{ value }}</span>
    </slot>
    <p v-if="error" :id="errorId" class="ink-field__error" role="alert">{{ error }}</p>
  </div>
</template>

<style lang="scss" scoped src="./inkField.scss" />
