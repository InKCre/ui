<script setup lang="ts">
import { createReusableTemplate } from "@vueuse/core";
import { inkTextareaProps, inkTextareaEmits } from "./inkTextarea";
import InkField from "../inkField/inkField.vue";
import { useFieldControl } from "../../composables/use-field-control";
defineOptions({ inheritAttrs: false });

const props = defineProps(inkTextareaProps);
const emit = defineEmits(inkTextareaEmits);

const { controlId, errorId, describedBy, fieldLayout, useField } = useFieldControl(props);

// --- methods ---
const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  emit("update:value", target.value);
};

const [DefineTextarea, ReuseTextarea] = createReusableTemplate();
</script>

<template>
  <DefineTextarea>
    <div class="ink-textarea" :class="{ 'ink-textarea--mono': mono }">
      <textarea
        v-if="editable"
        v-bind="$attrs"
        :id="controlId"
        :name="name"
        :required="required"
        :disabled="disabled"
        :aria-invalid="!!error || undefined"
        :aria-describedby="describedBy"
        class="ink-textarea__input"
        :value="value"
        :placeholder="placeholder"
        :rows="rows"
        @input="handleInput"
      />
      <div v-else class="ink-textarea__value">{{ value }}</div>
    </div>
  </DefineTextarea>

  <InkField
    v-if="useField"
    :label="label || ''"
    :for="controlId"
    :error="error"
    :error-id="errorId"
    :layout="fieldLayout"
    :required="required"
  >
    <ReuseTextarea />
  </InkField>

  <template v-else>
    <ReuseTextarea />
  </template>
</template>

<style lang="scss" scoped src="./inkTextarea.scss" />
