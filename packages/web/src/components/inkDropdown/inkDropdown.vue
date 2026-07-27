<script setup lang="ts">
import { computed, inject, ref, watch, onMounted } from "vue";
import { createReusableTemplate } from "@vueuse/core";
import {
  inkDropdownProps,
  inkDropdownEmits,
  type DropdownOption,
} from "./inkDropdown";
import InkField from "../inkField/inkField.vue";
import InkButton from "../inkButton/inkButton.vue";
import { INK_FORM_CONTEXT_KEY } from "../inkForm/inkForm";
import { useOptionalModel } from "../../composables/use-optional-model";

const props = defineProps(inkDropdownProps);
const emit = defineEmits(inkDropdownEmits);

const formContext = inject(INK_FORM_CONTEXT_KEY, null);

const useField = computed(() => formContext !== null && props.label);
const fieldLayout = computed(() => props.layout || formContext?.layout);

const showOptions = ref(false);
const isRefreshing = ref(false);
const searchText = ref("");
const isSearching = ref(false);
const searchInputRef = ref<HTMLInputElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);
const hoveredIndex = ref<number>(-1);

const optionsModel = useOptionalModel<DropdownOption[]>({
  props,
  emit,
  modelName: "options",
  defaultValue: [],
});

// --- computed ---
const displayValue = computed(() => {
  const option = optionsModel.value.find(
    (opt) => opt.value === props.modelValue
  );
  return option ? option.label : props.placeholder;
});

const filteredOptions = computed(() => {
  if (!searchText.value.trim()) {
    return optionsModel.value;
  }

  const query = searchText.value.toLowerCase();
  return optionsModel.value.filter((opt) => {
    const labelMatches = opt.label.toLowerCase().includes(query);
    const descriptionMatches = opt.description?.toLowerCase().includes(query);
    return labelMatches || descriptionMatches;
  });
});

const currentIndex = computed(() => {
  return optionsModel.value.findIndex((opt) => opt.value === props.modelValue);
});

const isSteppingDisabled = computed(() => {
  return !props.editable || optionsModel.value.length === 0;
});

// --- methods ---
const loadOptionsIfNeeded = async (force: boolean = false) => {
  if (optionsModel.value.length > 0 && !force) {
    return;
  }
  isRefreshing.value = true;
  try {
    if (props.refresher) {
      const options = await props.refresher();
      optionsModel.value = options;
    } else {
      return; // No load needed
    }
  } finally {
    isRefreshing.value = false;
  }
};

const onRefresh = async () => {
  await loadOptionsIfNeeded(true);
};

const onPrev = () => {
  if (isSteppingDisabled.value) return;
  const len = optionsModel.value.length;
  const nextIdx = (currentIndex.value - 1 + len) % len;
  onOptionSelect(optionsModel.value[nextIdx].value);
};

const onNext = () => {
  if (isSteppingDisabled.value) return;
  const len = optionsModel.value.length;
  const nextIdx = (currentIndex.value + 1) % len;
  onOptionSelect(optionsModel.value[nextIdx].value);
};

const onDropdownClick = async () => {
  if (props.editable) {
    if (showOptions.value) {
      showOptions.value = false;
    } else {
      // Load options before showing dropdown
      await loadOptionsIfNeeded();
      showOptions.value = true;
      // Initialize hover to current selection or first option
      hoveredIndex.value = currentIndex.value >= 0 ? currentIndex.value : 0;
      // Focus container to enable keyboard events
      setTimeout(() => {
        containerRef.value?.focus();
      }, 0);
    }
  }
};

const onOptionSelect = (value: DropdownOption["value"]) => {
  emit("update:modelValue", value);
  emit("change", value);
  showOptions.value = false;
  clearSearch();
};

const clearSearch = () => {
  searchText.value = "";
  isSearching.value = false;
  hoveredIndex.value = -1;
};

const startSearch = (char: string) => {
  searchText.value = char;
  isSearching.value = true;
  hoveredIndex.value = 0;
  // Focus input on next tick after it's rendered
  setTimeout(() => {
    searchInputRef.value?.focus();
  }, 0);
};

const handleContainerKeyDown = (e: KeyboardEvent) => {
  if (!showOptions.value || isRefreshing.value) return;

  const options = isSearching.value ? filteredOptions.value : optionsModel.value;

  // Arrow down navigates to next option
  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (options.length > 0) {
      hoveredIndex.value = (hoveredIndex.value + 1) % options.length;
    }
  }
  // Arrow up navigates to previous option
  else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (options.length > 0) {
      hoveredIndex.value = (hoveredIndex.value - 1 + options.length) % options.length;
    }
  }
  // Enter selects hovered option
  else if (e.key === "Enter") {
    e.preventDefault();
    if (hoveredIndex.value >= 0 && hoveredIndex.value < options.length) {
      onOptionSelect(options[hoveredIndex.value].value);
    }
  }
  // Start search on alphanumeric key
  else if (e.key.length === 1 && /[a-z0-9 ]/i.test(e.key) && !isSearching.value) {
    e.preventDefault();
    startSearch(e.key);
  }
  // ESC closes dropdown or clears search
  else if (e.key === "Escape") {
    e.preventDefault();
    if (isSearching.value) {
      clearSearch();
    } else {
      showOptions.value = false;
    }
  }
};

const handleSearchKeyDown = (e: KeyboardEvent) => {
  const options = filteredOptions.value;

  // Arrow down navigates to next option
  if (e.key === "ArrowDown") {
    e.preventDefault();
    e.stopPropagation();
    if (options.length > 0) {
      hoveredIndex.value = (hoveredIndex.value + 1) % options.length;
    }
  }
  // Arrow up navigates to previous option
  else if (e.key === "ArrowUp") {
    e.preventDefault();
    e.stopPropagation();
    if (options.length > 0) {
      hoveredIndex.value = (hoveredIndex.value - 1 + options.length) % options.length;
    }
  }
  // ESC clears search first, then closes dropdown
  else if (e.key === "Escape") {
    e.preventDefault();
    e.stopPropagation();
    if (searchText.value) {
      clearSearch();
    } else {
      showOptions.value = false;
    }
  }
  // Enter selects hovered option
  else if (e.key === "Enter" && options.length > 0) {
    e.preventDefault();
    e.stopPropagation();
    const idx = hoveredIndex.value >= 0 ? hoveredIndex.value : 0;
    onOptionSelect(options[idx].value);
  }
};

// Clear search when dropdown closes
watch(showOptions, (isOpen) => {
  if (!isOpen) {
    clearSearch();
  }
});

// Update hover to first option when search text changes
watch(searchText, (newVal) => {
  if (newVal && isSearching.value) {
    hoveredIndex.value = 0;
  }
});

// Load lazy options immediately if modelValue is set
onMounted(() => {
  const hasModelValue =
    props.modelValue !== undefined &&
    props.modelValue !== null &&
    props.modelValue !== "";
  const hasRefresher = props.refresher !== undefined;
  const hasNoOptions = optionsModel.value.length === 0;

  if (hasModelValue && hasRefresher && hasNoOptions) {
    loadOptionsIfNeeded();
  }
});

const [DefineDropdown, ReuseDropdown] = createReusableTemplate();
</script>

<template>
  <DefineDropdown>
    <div
      ref="containerRef"
      class="ink-dropdown-container"
      tabindex="0"
      @keydown="handleContainerKeyDown"
    >
      <!-- Box -->
      <div
        :class="[
          'ink-dropdown',
          {
            'ink-dropdown--editable': editable,
            'ink-dropdown--active': showOptions,
            'ink-dropdown--searching': isSearching,
          },
        ]"
        @click="onDropdownClick"
      >
        <input
          v-if="isSearching"
          ref="searchInputRef"
          v-model="searchText"
          class="ink-dropdown__search-input"
          type="text"
          @keydown="handleSearchKeyDown"
          @click.stop
        />
        <span v-else class="ink-dropdown__value">{{ displayValue }}</span>

        <span
          v-if="editable"
          :class="['i-mdi-chevron-down', 'ink-dropdown__chevron']"
        ></span>
      </div>

      <!-- Stepping Buttons -->
      <template v-if="enableStepping">
        <InkButton
          icon="i-mdi-chevron-left"
          :disabled="isSteppingDisabled"
          @click="onPrev"
          type="square"
          title="Previous"
        />
        <InkButton
          icon="i-mdi-chevron-right"
          :disabled="isSteppingDisabled"
          type="square"
          @click="onNext"
          title="Next"
        />
      </template>

      <!-- Refresh Button -->
      <InkButton
        v-if="props.refresher"
        class="ink-dropdown__refresh"
        :icon="`i-mdi-refresh ${isRefreshing ? 'animate-spin' : ''}`"
        :disabled="isRefreshing"
        type="square"
        @click="onRefresh"
        title="Refresh options"
      />

      <!-- Options -->
      <div v-if="showOptions" class="ink-dropdown__options">
        <div v-if="isRefreshing" class="ink-dropdown__loading">
          <span class="i-mdi-loading animate-spin"></span>
          Loading...
        </div>
        <template v-else>
          <div v-if="filteredOptions.length === 0" class="ink-dropdown__empty">
            No matching options
          </div>
          <div v-for="(option, index) in filteredOptions" :key="option.value">
            <div
              :class="[
                'ink-dropdown__option',
                {
                  'ink-dropdown__option--selected': option.value === modelValue,
                  'ink-dropdown__option--hovered': hoveredIndex === index,
                },
              ]"
              @click="onOptionSelect(option.value)"
            >
              <span class="option__label">{{ option.label }}</span>
              <span class="option__description" v-if="option.description">{{
                option.description
              }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </DefineDropdown>

  <InkField
    v-if="useField"
    :label="label"
    :layout="fieldLayout"
    :required="required"
  >
    <ReuseDropdown />
  </InkField>

  <template v-else>
    <ReuseDropdown />
  </template>
</template>

<style lang="scss" scoped src="./inkDropdown.scss" />
