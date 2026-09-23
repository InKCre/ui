<script setup lang="ts">
import { computed, useId } from "vue";
import type { JSONSchema, JSONSchemaProperty } from "./inkAutoForm";
import {
  initialFormValue,
  mapSchemaPropertyToComponent,
  parseFieldDate,
  resolveFormSchema,
  schemaFieldLabel,
  serializeFieldDate,
} from "./inkAutoForm";
import InkInput from "../inkInput/inkInput.vue";
import InkTextarea from "../inkTextarea/inkTextarea.vue";
import InkSwitch from "../inkSwitch/inkSwitch.vue";
import InkDropdown from "../inkDropdown/inkDropdown.vue";
import InkPicker from "../inkPicker/inkPicker.vue";
import InkField from "../inkField/inkField.vue";
import { useOptionalI18n } from "../../i18n";

defineOptions({ name: "InkAutoFormField" });
const props = defineProps<{
  schema: JSONSchemaProperty;
  root: JSONSchema;
  value: unknown;
  label: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  depth?: number;
}>();
const emit = defineEmits<{ "update:value": [value: unknown] }>();
const id = useId();
const i18n = useOptionalI18n();
const message = (key: string, fallback: string) => i18n?.t(`autoForm.${key}`) ?? fallback;
const resolved = computed(() => resolveFormSchema(props.schema, props.root));
const mapping = computed(() =>
  resolved.value ? mapSchemaPropertyToComponent(resolved.value) : null,
);
const entries = computed(() => Object.entries(resolved.value?.properties ?? {}));
const items = computed(() => (Array.isArray(props.value) ? props.value : []));
function updateChild(key: string, value: unknown) {
  const current =
    props.value && typeof props.value === "object" && !Array.isArray(props.value)
      ? (props.value as Record<string, unknown>)
      : {};
  emit("update:value", { ...current, [key]: value });
}
function updateItem(index: number, value: unknown) {
  const next = [...items.value];
  next[index] = value;
  emit("update:value", next);
}
function updateScalar(value: unknown) {
  if (
    (resolved.value?.type === "number" || resolved.value?.type === "integer") &&
    typeof value === "string"
  ) {
    if (value.trim() === "") {
      emit("update:value", undefined);
      return;
    }
    const parsed = Number(value);
    emit("update:value", Number.isFinite(parsed) ? parsed : value);
    return;
  }
  emit("update:value", value);
}
</script>

<template>
  <div class="ink-auto-form__field">
    <div v-if="resolved?.nullable && value === null" class="ink-auto-form__nullable">
      <span>{{ label }}</span>
      <button
        type="button"
        :disabled="disabled"
        @click="emit('update:value', initialFormValue(schema, root))"
      >
        {{ message("setValue", "Set value") }}
      </button>
    </div>
    <template v-else-if="resolved?.type === 'object'">
      <fieldset class="ink-auto-form__group">
        <legend>{{ label }}</legend>
        <p v-if="error" role="alert" class="ink-auto-form__field-error">{{ error }}</p>
        <p v-if="resolved.description" class="ink-auto-form__description">
          {{ resolved.description }}
        </p>
        <button
          v-if="resolved.nullable"
          type="button"
          :disabled="disabled"
          class="ink-auto-form__secondary"
          @click="emit('update:value', null)"
        >
          {{ message("clearValue", "Clear value") }}
        </button>
        <InkAutoFormField
          v-for="[key, child] in entries"
          :key="key"
          :schema="child"
          :root="root"
          :value="(value as Record<string, unknown> | null)?.[key]"
          :label="child.title || schemaFieldLabel(key)"
          :required="resolved.required?.includes(key)"
          :disabled="disabled"
          :depth="(depth ?? 0) + 1"
          @update:value="updateChild(key, $event)"
        />
      </fieldset>
    </template>
    <template v-else-if="resolved?.type === 'array'">
      <fieldset class="ink-auto-form__group">
        <legend>{{ label }}</legend>
        <p v-if="error" role="alert" class="ink-auto-form__field-error">{{ error }}</p>
        <p v-if="resolved.description" class="ink-auto-form__description">
          {{ resolved.description }}
        </p>
        <div v-for="(item, index) in items" :key="index" class="ink-auto-form__array-item">
          <InkAutoFormField
            v-if="resolved.items"
            :schema="resolved.items"
            :root="root"
            :value="item"
            :label="`${label} ${index + 1}`"
            :depth="(depth ?? 0) + 1"
            :disabled="disabled"
            @update:value="updateItem(index, $event)"
          />
          <button
            type="button"
            :disabled="disabled"
            @click="
              emit(
                'update:value',
                items.filter((_, itemIndex) => itemIndex !== index),
              )
            "
          >
            {{ message("remove", "Remove") }}
          </button>
        </div>
        <button
          type="button"
          :disabled="disabled"
          @click="emit('update:value', [...items, initialFormValue(resolved.items!, root)])"
        >
          {{ message("add", "Add") }} {{ label }}
        </button>
      </fieldset>
    </template>
    <InkInput
      v-else-if="mapping?.component === 'inkInput'"
      v-bind="mapping.props"
      :id="id"
      :model-value="String(value ?? '')"
      :label="label"
      :required="required"
      :disabled="disabled"
      :placeholder="resolved?.description"
      :maxlength="resolved?.maxLength"
      :pattern="resolved?.pattern"
      :error="error"
      @update:model-value="updateScalar($event)"
    />
    <InkTextarea
      v-else-if="mapping?.component === 'inkTextarea'"
      v-bind="mapping.props"
      :id="id"
      :value="String(value ?? '')"
      :label="label"
      :required="required"
      :disabled="disabled"
      :placeholder="resolved?.description"
      :maxlength="resolved?.maxLength"
      :error="error"
      @update:value="updateScalar($event)"
    />
    <InkField
      v-else-if="mapping?.component === 'inkSwitch'"
      :for="id"
      :label="label"
      :required="required"
      :error="error"
      :error-id="`${id}-error`"
    >
      <InkSwitch
        :id="id"
        :aria-label="label"
        :aria-describedby="error ? `${id}-error` : undefined"
        :aria-invalid="!!error || undefined"
        :model-value="value === true"
        :disabled="disabled"
        @update:model-value="updateScalar($event)"
      />
    </InkField>
    <InkDropdown
      v-else-if="mapping?.component === 'inkDropdown'"
      v-bind="mapping.props"
      :id="id"
      :model-value="value as string | number | null | undefined"
      :label="label"
      :required="required"
      :disabled="disabled"
      :error="error"
      @update:model-value="updateScalar($event)"
    />
    <InkPicker
      v-else-if="mapping?.component === 'inkPicker'"
      v-bind="mapping.props"
      :id="id"
      :model-value="parseFieldDate(value, resolved?.format)"
      :formatter="() => String(value ?? '')"
      :label="label"
      :required="required"
      :disabled="disabled"
      :error="error"
      @update:model-value="
        (date) => {
          if (date instanceof Date) updateScalar(serializeFieldDate(date, resolved?.format));
        }
      "
    />
    <button
      v-if="
        resolved?.nullable &&
        value !== null &&
        resolved.type !== 'object' &&
        resolved.type !== 'array'
      "
      type="button"
      class="ink-auto-form__secondary"
      :disabled="disabled"
      @click="emit('update:value', null)"
    >
      {{ message("clearValue", "Clear value") }}
    </button>
  </div>
</template>

<style lang="scss" scoped src="./inkAutoForm.scss" />
