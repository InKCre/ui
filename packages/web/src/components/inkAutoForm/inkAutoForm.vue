<script setup lang="ts">
import { computed, watch, ref } from "vue";
import {
  inkAutoFormProps,
  inkAutoFormEmits,
  mapSchemaPropertyToComponent,
  validateFormData,
  type JSONSchemaProperty,
} from "./inkAutoForm";
import InkForm from "../inkForm/inkForm.vue";
import InkInput from "../inkInput/inkInput.vue";
import InkTextarea from "../inkTextarea/inkTextarea.vue";
import InkSwitch from "../inkSwitch/inkSwitch.vue";
import InkDropdown from "../inkDropdown/inkDropdown.vue";
import InkPicker from "../inkPicker/inkPicker.vue";
import { jsonService } from "../inkJsonEditor/jsonSchemaService";

const props = defineProps(inkAutoFormProps);
const emit = defineEmits(inkAutoFormEmits);

// --- data ---
const internalFormData = ref<Record<string, any>>({ ...props.formData });
const validationErrors = ref<Record<string, string[]>>({});

// --- computed ---

const schemaIsValid = computed(() => {
  return (
    props.schema &&
    props.schema.type === "object" &&
    props.schema.properties &&
    typeof props.schema.properties === "object"
  );
});

const fields = computed(() => {
  if (!schemaIsValid.value) return [];

  const result: Array<{
    key: string;
    property: JSONSchemaProperty;
    component: string;
    componentProps: Record<string, any>;
    label: string;
    description?: string;
    required: boolean;
    defaultValue?: any;
  }> = [];

  const properties = props.schema.properties;
  const required = props.schema.required || [];

  for (const [key, property] of Object.entries(properties)) {
    const mapping = mapSchemaPropertyToComponent(
      property as JSONSchemaProperty
    );

    result.push({
      key,
      property: property as JSONSchemaProperty,
      component: mapping.component,
      componentProps: mapping.props,
      label: property.title || key,
      description: property.description,
      required: required.includes(key),
      defaultValue: property.default,
    });
  }

  return result;
});

// --- methods ---

const updateFieldValue = (key: string, value: any) => {
  internalFormData.value[key] = value;
  emit("update:formData", { ...internalFormData.value });
};

const performValidation = async () => {
  const result = await validateFormData(
    internalFormData.value,
    props.schema,
    jsonService
  );
  validationErrors.value = result.errors;
};

// --- watchers ---

watch(
  () => props.formData,
  (newData) => {
    internalFormData.value = { ...newData };
  },
  { deep: true }
);

watch(
  () => props.schema,
  () => {
    // Initialize form data with defaults when schema changes
    if (schemaIsValid.value) {
      const newData: Record<string, any> = {};

      for (const field of fields.value) {
        if (field.defaultValue !== undefined) {
          newData[field.key] = field.defaultValue;
        } else if (internalFormData.value[field.key] !== undefined) {
          newData[field.key] = internalFormData.value[field.key];
        }
      }

      internalFormData.value = newData;
      emit("update:formData", { ...newData });
    }
  },
  { immediate: true }
);

// Validate on data change
watch(
  internalFormData,
  () => {
    performValidation();
  },
  { deep: true }
);

// --- lifecycle hooks ---

// --- exposes ---
</script>

<template>
  <InkForm :layout="layout" @submit.prevent>
    <div v-if="!schemaIsValid" class="ink-auto-form__error">
      Invalid schema: Expected an object type with properties.
    </div>

    <template v-else>
      <div
        v-for="field in fields"
        :key="field.key"
        class="ink-auto-form__field"
      >
        <!-- String Input -->
        <InkInput
          v-if="field.component === 'inkInput'"
          :model-value="String(internalFormData[field.key] || '')"
          :label="field.label"
          :required="field.required"
          :placeholder="field.description"
          :layout="layout"
          @update:model-value="updateFieldValue(field.key, $event)"
        />

        <!-- Textarea -->
        <InkTextarea
          v-else-if="field.component === 'inkTextarea'"
          :value="String(internalFormData[field.key] || '')"
          :label="field.label"
          :required="field.required"
          :placeholder="field.description"
          :layout="layout"
          v-bind="field.componentProps"
          @update:value="updateFieldValue(field.key, $event)"
        />

        <!-- Switch -->
        <InkSwitch
          v-else-if="field.component === 'inkSwitch'"
          :model-value="Boolean(internalFormData[field.key])"
          @update:model-value="updateFieldValue(field.key, $event)"
        />

        <!-- Dropdown -->
        <InkDropdown
          v-else-if="field.component === 'inkDropdown'"
          :model-value="internalFormData[field.key]"
          :label="field.label"
          :required="field.required"
          :layout="layout"
          v-bind="field.componentProps"
          @update:model-value="updateFieldValue(field.key, $event)"
        />

        <!-- Date/Time Picker -->
        <InkPicker
          v-else-if="field.component === 'inkPicker'"
          :model-value="internalFormData[field.key]"
          :label="field.label"
          :required="field.required"
          :layout="layout"
          v-bind="field.componentProps"
          @update:model-value="updateFieldValue(field.key, $event)"
        />

        <!-- Validation Errors -->
        <div
          v-if="validationErrors[field.key]"
          class="ink-auto-form__field-errors"
        >
          <span
            v-for="(error, idx) in validationErrors[field.key]"
            :key="idx"
            class="ink-auto-form__field-error"
          >
            {{ error }}
          </span>
        </div>
      </div>
    </template>
  </InkForm>
</template>

<style lang="scss" scoped src="./inkAutoForm.scss" />
