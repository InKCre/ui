<script setup lang="ts">
import { provide } from "vue";
import { inkFormProps, inkFormEmits, INK_FORM_CONTEXT_KEY, type InkFormContext } from "./inkForm";

const props = defineProps(inkFormProps);
const emit = defineEmits(inkFormEmits);

provide(INK_FORM_CONTEXT_KEY, {
  get layout() {
    return props.layout;
  },
} satisfies InkFormContext);

// --- methods ---
const onSubmit = (e: Event) => {
  e.preventDefault();
  emit("submit", e);
};
</script>

<template>
  <form class="ink-form" @submit="onSubmit">
    <slot />
  </form>
</template>

<style lang="scss" scoped src="./inkForm.scss" />
