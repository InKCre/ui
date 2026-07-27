<script setup lang="ts">
import { computed } from "vue";
import { inkPlaceholderProps } from "./inkPlaceholder";
import { useOptionalI18n } from "../../i18n";

const props = defineProps(inkPlaceholderProps);
const i18n = useOptionalI18n();

const placeholderClass = computed(() => [
  "ink-placeholder",
  `ink-placeholder--${props.state}`,
]);

const defaultIllustration = computed(() => {
  if (props.illustration) return props.illustration;
  return props.state === "error" ? "i-mdi-alert-circle-outline" : "i-mdi-inbox-outline";
});

const getTranslatedText = (messageType: "title" | "description") => {
  const isError = props.state === "error";
  
  if (i18n) {
    const key = `placeholder.${isError ? "error" : "empty"}.${messageType}`;
    return i18n.t(key);
  }
  
  if (messageType === "title") {
    return isError ? "Something went wrong" : "No data";
  }
  
  return isError 
    ? "An error occurred. Please try again." 
    : "There's nothing here yet.";
};

const defaultTitle = computed(() => {
  if (props.title) return props.title;
  return getTranslatedText("title");
});

const defaultDescription = computed(() => {
  if (props.description) return props.description;
  return getTranslatedText("description");
});
</script>

<template>
  <div :class="placeholderClass">
    <div class="ink-placeholder__illustration">
      <slot name="illustration">
        <span :class="defaultIllustration" />
      </slot>
    </div>
    
    <div class="ink-placeholder__title">
      <slot name="title">
        <span>{{ defaultTitle }}</span>
      </slot>
    </div>
    
    <div class="ink-placeholder__description">
      <slot name="description">
        <span>{{ defaultDescription }}</span>
      </slot>
    </div>
    
    <div v-if="$slots.actions" class="ink-placeholder__actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./inkPlaceholder.scss"></style>
