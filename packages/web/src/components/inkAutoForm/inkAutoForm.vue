<script setup lang="ts">
import { computed, watch, ref, useId } from "vue";
import {
  inkAutoFormProps,
  inkAutoFormEmits,
  mapSchemaPropertyToComponent,
  validateFormData,
  parseFieldDate,
  serializeFieldDate,
  type FormValidation,
  type JSONSchemaProperty,
} from "./inkAutoForm";
import InkForm from "../inkForm/inkForm.vue";
import InkField from "../inkField/inkField.vue";
import InkInput from "../inkInput/inkInput.vue";
import InkTextarea from "../inkTextarea/inkTextarea.vue";
import InkSwitch from "../inkSwitch/inkSwitch.vue";
import InkDropdown from "../inkDropdown/inkDropdown.vue";
import InkPicker from "../inkPicker/inkPicker.vue";
import { createJsonService } from "../inkJsonEditor/jsonSchemaService";
const props = defineProps(inkAutoFormProps);
const emit = defineEmits(inkAutoFormEmits);
const formId = useId();
const internalFormData = ref<Record<string, unknown>>({ ...props.formData });
const validation = ref<FormValidation>({
  valid: false,
  status: "pending",
  errors: {},
  rootErrors: [],
});
let service = createJsonService();
const schemaIsValid = computed(
  () =>
    props.schema?.type === "object" &&
    props.schema.properties &&
    typeof props.schema.properties === "object" &&
    !Array.isArray(props.schema.properties),
);
const fields = computed(() =>
  !schemaIsValid.value
    ? []
    : Object.entries(props.schema.properties).map(([key, rawProperty], index) => {
        const validProperty =
          rawProperty && typeof rawProperty === "object" && !Array.isArray(rawProperty);
        const property: JSONSchemaProperty = validProperty ? rawProperty : { type: "string" };
        const supported =
          !!validProperty && ["string", "number", "integer", "boolean"].includes(property.type);
        return {
          key,
          property,
          id: `${formId}-${index}`,
          label: property.title || key,
          supported,
          required: props.schema.required?.includes(key) ?? false,
          ...(supported
            ? mapSchemaPropertyToComponent(property)
            : { component: "unsupported", props: {} }),
        };
      }),
);

const errorFor = (key: string) => validation.value.errors[key]?.join("\n") || "";
function report(result: FormValidation) {
  validation.value = result;
  emit("validation", result);
}
function updateFieldValue(key: string, value: unknown, numeric = false) {
  const next = { ...internalFormData.value };
  if (numeric && typeof value === "string" && value.trim() === "") delete next[key];
  else {
    const parsed = numeric && typeof value === "string" ? Number(value) : value;
    // Invalid values remain invalid and visible to schema validation, never silently become zero.
    next[key] = numeric && typeof parsed === "number" && !Number.isFinite(parsed) ? value : parsed;
  }
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
    if (!schemaIsValid.value) return;
    const defaults = Object.fromEntries(
      fields.value
        .filter(
          (field) =>
            internalFormData.value[field.key] === undefined && field.property.default !== undefined,
        )
        .map((field) => [field.key, field.property.default]),
    );
    if (!Object.keys(defaults).length) return;
    internalFormData.value = { ...internalFormData.value, ...defaults };
    emit("update:formData", { ...internalFormData.value });
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
    const unsupported = fields.value.filter((field) => !field.supported);
    if (!schemaIsValid.value || unsupported.length) {
      report({
        valid: false,
        status: "error",
        errors: {},
        rootErrors: [
          !schemaIsValid.value
            ? "Expected an object schema with flat properties"
            : `Unsupported field types: ${unsupported.map((field) => field.key).join(", ")}`,
        ],
      });
      return;
    }
    report({ valid: false, status: "pending", errors: {}, rootErrors: [] });
    try {
      const result = await validateFormData(internalFormData.value, service);
      if (active) {
        report(result);
        if (result.status === "error")
          emit(
            "error",
            new Error([...result.rootErrors, ...Object.values(result.errors).flat()].join("\n")),
          );
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
  <InkForm :layout="layout" :aria-busy="validation.status === 'pending' || undefined">
    <div v-if="validation.rootErrors.length" class="ink-auto-form__error" role="alert">
      <p v-for="error in validation.rootErrors" :key="error">{{ error }}</p>
    </div>
    <div v-for="field in fields" :key="field.key" class="ink-auto-form__field">
      <InkInput
        v-if="field.supported && field.component === 'inkInput'"
        v-bind="field.props"
        :id="field.id"
        :model-value="String(internalFormData[field.key] ?? '')"
        :label="field.label"
        :required="field.required"
        :placeholder="field.property.description"
        :maxlength="field.property.maxLength"
        :pattern="field.property.pattern"
        :error="errorFor(field.key)"
        @update:model-value="
          updateFieldValue(
            field.key,
            $event,
            field.property.type === 'number' || field.property.type === 'integer',
          )
        "
      />
      <InkTextarea
        v-else-if="field.component === 'inkTextarea'"
        v-bind="field.props"
        :id="field.id"
        :value="String(internalFormData[field.key] ?? '')"
        :label="field.label"
        :required="field.required"
        :placeholder="field.property.description"
        :maxlength="field.property.maxLength"
        :error="errorFor(field.key)"
        @update:value="updateFieldValue(field.key, $event)"
      />
      <InkField
        v-else-if="field.component === 'inkSwitch'"
        :for="field.id"
        :label="field.label"
        :layout="layout"
        :required="field.required"
        :error="errorFor(field.key)"
        :error-id="`${field.id}-error`"
      >
        <InkSwitch
          :id="field.id"
          :aria-label="field.label"
          :aria-describedby="errorFor(field.key) ? `${field.id}-error` : undefined"
          :aria-invalid="!!errorFor(field.key) || undefined"
          :model-value="internalFormData[field.key] === true"
          @update:model-value="updateFieldValue(field.key, $event)"
        />
      </InkField>
      <InkDropdown
        v-else-if="field.component === 'inkDropdown'"
        v-bind="field.props"
        :id="field.id"
        :model-value="internalFormData[field.key] as string | number | null | undefined"
        :label="field.label"
        :required="field.required"
        :error="errorFor(field.key)"
        @update:model-value="updateFieldValue(field.key, $event)"
      />
      <InkPicker
        v-else-if="field.component === 'inkPicker'"
        v-bind="field.props"
        :id="field.id"
        :model-value="parseFieldDate(internalFormData[field.key], field.property.format)"
        :formatter="() => String(internalFormData[field.key] ?? '')"
        :label="field.label"
        :required="field.required"
        :error="errorFor(field.key)"
        @update:model-value="
          (value) => {
            if (value instanceof Date)
              updateFieldValue(field.key, serializeFieldDate(value, field.property.format));
          }
        "
      />
    </div>
  </InkForm>
</template>
<style lang="scss" scoped src="./inkAutoForm.scss" />
