<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { createReusableTemplate, onClickOutside } from "@vueuse/core";
import { inkDropdownProps, inkDropdownEmits, type DropdownOption } from "./inkDropdown";
import InkField from "../inkField/inkField.vue";
import InkButton from "../inkButton/inkButton.vue";
import { useFieldControl } from "../../composables/use-field-control";
import { useOptionalModel } from "../../composables/use-optional-model";

defineOptions({ inheritAttrs: false });
const props = defineProps(inkDropdownProps);
const emit = defineEmits(inkDropdownEmits);
const { controlId, errorId, describedBy, fieldLayout, useField } = useFieldControl(props);
const container = ref<HTMLElement>();
const trigger = ref<HTMLButtonElement>();
const searchInput = ref<HTMLInputElement>();
const showOptions = ref(false);
const isRefreshing = ref(false);
const loadError = ref("");
const searchText = ref("");
const hoveredIndex = ref(0);
const optionsModel = useOptionalModel<DropdownOption[]>({
  props,
  emit,
  modelName: "options",
  defaultValue: [],
});
const disabled = computed(() => props.disabled || !props.editable);
const currentIndex = computed(() =>
  optionsModel.value.findIndex((option) => option.value === props.modelValue),
);
const displayValue = computed(
  () => optionsModel.value[currentIndex.value]?.label ?? props.placeholder,
);
const filteredOptions = computed(() => {
  const query = searchText.value.toLocaleLowerCase();
  return optionsModel.value.filter((option) =>
    `${option.label} ${option.description ?? ""}`.toLocaleLowerCase().includes(query),
  );
});
const activeId = computed(() =>
  showOptions.value && filteredOptions.value[hoveredIndex.value]
    ? `${controlId.value}-option-${hoveredIndex.value}`
    : undefined,
);
let request = 0;
async function loadOptions(force = false) {
  if (!props.refresher || (!force && optionsModel.value.length)) return;
  const identity = ++request;
  isRefreshing.value = true;
  loadError.value = "";
  try {
    const options = await props.refresher();
    if (identity === request) optionsModel.value = options;
  } catch (error) {
    if (identity === request) {
      loadError.value = "Unable to load options";
      emit("error", error);
    }
  } finally {
    if (identity === request) isRefreshing.value = false;
  }
}
onBeforeUnmount(() => {
  request++;
});
watch(
  () => props.refresher,
  () => {
    request++;
    isRefreshing.value = false;
    loadError.value = "";
  },
);
watch(searchText, () => {
  hoveredIndex.value = 0;
});
watch(
  () => props.disabled || !props.editable,
  (value) => {
    if (value) close();
  },
);
watch(filteredOptions, (options) => {
  hoveredIndex.value = Math.min(hoveredIndex.value, Math.max(0, options.length - 1));
});
onClickOutside(container, () => close());
function close() {
  showOptions.value = false;
  searchText.value = "";
}
function open() {
  if (disabled.value) return;
  showOptions.value = true;
  hoveredIndex.value = Math.max(0, currentIndex.value);
  void loadOptions();
}
function select(option: DropdownOption) {
  if (disabled.value || isRefreshing.value) return;
  emit("update:modelValue", option.value);
  emit("change", option.value);
  close();
  trigger.value?.focus();
}
function step(direction: number) {
  if (disabled.value || isRefreshing.value || !optionsModel.value.length) return;
  const count = optionsModel.value.length;
  select(optionsModel.value[(currentIndex.value + direction + count) % count]);
}
async function handleKey(event: KeyboardEvent) {
  if (disabled.value || event.isComposing) return;
  const fromSearch = event.target === searchInput.value;
  if (event.key === "Tab") {
    close();
    return;
  }
  if (event.key === "Escape" && showOptions.value) {
    event.preventDefault();
    event.stopPropagation();
    close();
    trigger.value?.focus();
    return;
  }
  if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
    event.preventDefault();
    if (!showOptions.value) {
      open();
      return;
    }
    const count = filteredOptions.value.length;
    if (!count) return;
    if (event.key === "Home") hoveredIndex.value = 0;
    else if (event.key === "End") hoveredIndex.value = count - 1;
    else
      hoveredIndex.value =
        (hoveredIndex.value + (event.key === "ArrowDown" ? 1 : -1) + count) % count;
    await nextTick();
    document.getElementById(activeId.value ?? "")?.scrollIntoView({ block: "nearest" });
  } else if (event.key === "Enter" || (!fromSearch && event.key === " ")) {
    event.preventDefault();
    if (!showOptions.value) open();
    else {
      const option = filteredOptions.value[hoveredIndex.value];
      if (option) select(option);
    }
  } else if (
    !fromSearch &&
    event.key.length === 1 &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey
  ) {
    event.preventDefault();
    if (!showOptions.value) open();
    searchText.value = event.key;
    await nextTick();
    searchInput.value?.focus();
  }
}
onMounted(() => {
  if (props.modelValue !== undefined && props.modelValue !== null && props.modelValue !== "")
    void loadOptions();
});
const [DefineDropdown, ReuseDropdown] = createReusableTemplate();
</script>
<template>
  <DefineDropdown>
    <div
      ref="container"
      class="ink-dropdown-container"
      @focusout="
        (event) => {
          if (!container?.contains(event.relatedTarget as Node)) close();
        }
      "
    >
      <button
        v-bind="$attrs"
        :id="controlId"
        ref="trigger"
        type="button"
        role="combobox"
        :disabled="disabled"
        :aria-expanded="showOptions"
        :aria-controls="`${controlId}-options`"
        aria-haspopup="listbox"
        :aria-activedescendant="activeId"
        :aria-required="required || undefined"
        :aria-invalid="!!error || undefined"
        :aria-describedby="describedBy"
        :class="[
          'ink-dropdown',
          { 'ink-dropdown--editable': !disabled, 'ink-dropdown--active': showOptions },
        ]"
        @click="showOptions ? close() : open()"
        @keydown="handleKey"
      >
        <span class="ink-dropdown__value">{{ displayValue }}</span
        ><span
          v-if="!disabled"
          class="i-mdi-chevron-down ink-dropdown__chevron"
          aria-hidden="true"
        />
      </button>
      <input
        v-if="name"
        type="hidden"
        :name="name"
        :value="modelValue ?? ''"
        :disabled="disabled"
      />
      <template v-if="enableStepping">
        <InkButton
          icon="i-mdi-chevron-left"
          type="square"
          aria-label="Previous option"
          :disabled="disabled || isRefreshing || !optionsModel.length"
          @click="step(-1)"
        />
        <InkButton
          icon="i-mdi-chevron-right"
          type="square"
          aria-label="Next option"
          :disabled="disabled || isRefreshing || !optionsModel.length"
          @click="step(1)"
        />
      </template>
      <InkButton
        v-if="refresher"
        icon="i-mdi-refresh"
        type="square"
        aria-label="Refresh options"
        :is-loading="isRefreshing"
        :disabled="disabled"
        @click="loadOptions(true)"
      />
      <div v-if="showOptions" class="ink-dropdown__options">
        <!-- Keep focus inside until the label click focuses its input. -->
        <label
          class="ink-dropdown__search"
          @mousedown="(event) => event.target !== searchInput && event.preventDefault()"
        >
          <span class="i-mdi-magnify ink-dropdown__search-icon" aria-hidden="true" />
          <input
            ref="searchInput"
            v-model="searchText"
            role="combobox"
            aria-label="Search options"
            :aria-expanded="showOptions"
            :aria-controls="`${controlId}-options`"
            :aria-activedescendant="activeId"
            class="ink-dropdown__search-input"
            @keydown="handleKey"
          />
        </label>
        <div v-if="isRefreshing" role="status" class="ink-dropdown__loading">Loading...</div>
        <div :id="`${controlId}-options`" role="listbox" :aria-label="label || placeholder">
          <div
            v-for="(option, index) in filteredOptions"
            :id="`${controlId}-option-${index}`"
            :key="option.value"
            role="option"
            :aria-selected="option.value === modelValue"
            :class="[
              'ink-dropdown__option',
              {
                'ink-dropdown__option--selected': option.value === modelValue,
                'ink-dropdown__option--hovered': hoveredIndex === index,
              },
            ]"
            @mousedown.prevent
            @click="select(option)"
          >
            <span class="option__label">{{ option.label }}</span
            ><span v-if="option.description" class="option__description">{{
              option.description
            }}</span>
          </div>
        </div>
        <div v-if="!isRefreshing && !filteredOptions.length" class="ink-dropdown__empty">
          No matching options
        </div>
      </div>
      <span v-if="loadError" role="alert">{{ loadError }}</span>
    </div>
  </DefineDropdown>
  <InkField
    v-if="useField"
    :for="controlId"
    :label="label || ''"
    :layout="fieldLayout"
    :required="required"
    :error="error"
    :error-id="errorId"
    ><ReuseDropdown
  /></InkField>
  <ReuseDropdown v-else />
</template>
<style lang="scss" scoped src="./inkDropdown.scss" />
