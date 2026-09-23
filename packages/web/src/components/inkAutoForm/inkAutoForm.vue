<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  canRenderJsonSchema,
  inkAutoFormEmits,
  inkAutoFormProps,
  resolveFormSchema,
  schemaFieldLabel,
  validateFormData,
  type FormValidation,
} from "./inkAutoForm";
import InkForm from "../inkForm/inkForm.vue";
import InkAutoFormField from "./inkAutoFormField.vue";
import { createJsonService } from "../inkJsonEditor/jsonSchemaService";

const props = defineProps(inkAutoFormProps);
const emit = defineEmits(inkAutoFormEmits);
const internalFormData = ref<Record<string, unknown>>({ ...props.formData });
const validation = ref<FormValidation>({
  valid: false,
  status: "pending",
  errors: {},
  rootErrors: [],
});
const supported = computed(() => canRenderJsonSchema(props.schema));
let service = createJsonService();

function report(result: FormValidation) {
  validation.value = result;
  emit("validation", result);
}
function updateFieldValue(key: string, value: unknown) {
  const next = { ...internalFormData.value };
  if (value === undefined) delete next[key];
  else next[key] = value;
  internalFormData.value = next;
  emit("update:formData", next);
}
watch(
  () => props.formData,
  (value) => {
    internalFormData.value = { ...value };
  },
  { deep: true },
);
watch(
  () => props.schema,
  () => {
    service = createJsonService(props.schema);
    if (!supported.value) return;
    const defaults = Object.fromEntries(
      Object.entries(props.schema.properties)
        .filter(([key]) => internalFormData.value[key] === undefined)
        .map(([key, property]) => [key, resolveFormSchema(property, props.schema)?.default])
        .filter(([, value]) => value !== undefined),
    );
    if (Object.keys(defaults).length) {
      internalFormData.value = { ...internalFormData.value, ...defaults };
      emit("update:formData", { ...internalFormData.value });
    }
  },
  { immediate: true, deep: true },
);
watch(
  [internalFormData, () => props.schema],
  async (_value, _oldValue, onCleanup) => {
    let active = true;
    onCleanup(() => {
      active = false;
    });
    if (!supported.value) {
      report({
        valid: false,
        status: "error",
        errors: {},
        rootErrors: ["Unsupported JSON Schema"],
      });
      return;
    }
    report({ valid: false, status: "pending", errors: {}, rootErrors: [] });
    try {
      const result = await validateFormData(internalFormData.value, service);
      if (active) {
        report(result);
        if (result.status === "error") emit("error", new Error(result.rootErrors.join("\n")));
      }
    } catch (error) {
      if (!active) return;
      report({
        valid: false,
        status: "error",
        errors: {},
        rootErrors: [error instanceof Error ? error.message : String(error)],
      });
      emit("error", error);
    }
  },
  { immediate: true, deep: true },
);
</script>

<template>
  <component
    :is="embedded ? 'div' : InkForm"
    class="ink-auto-form"
    :layout="layout"
    :aria-busy="validation.status === 'pending' || undefined"
  >
    <div v-if="validation.rootErrors.length" class="ink-auto-form__error" role="alert">
      <p v-for="error in validation.rootErrors" :key="error">{{ error }}</p>
    </div>
    <InkAutoFormField
      v-for="[key, property] in Object.entries(schema.properties ?? {})"
      v-if="supported"
      :key="key"
      :schema="property"
      :root="schema"
      :value="internalFormData[key]"
      :label="property.title || schemaFieldLabel(key)"
      :required="schema.required?.includes(key)"
      :disabled="disabled"
      :error="validation.errors[key]?.join('\n')"
      @update:value="updateFieldValue(key, $event)"
    />
  </component>
</template>

<style lang="scss" scoped src="./inkAutoForm.scss" />
