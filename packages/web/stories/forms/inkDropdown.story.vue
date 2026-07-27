<script setup lang="ts">
import { ref } from "vue";
import InkDropdown from "../../src/components/inkDropdown/inkDropdown.vue";

const selectedValue = ref("");
const asyncValue = ref("");
const counter = ref(0);
const options = ref([
  { label: "Option 1", value: 1 },
  { label: "Option 2", value: 2 },
  { label: "Option 3", value: 3 },
]);
const optionsWithDescription = [
  { label: "Option 1", value: 1, description: "First choice" },
  { label: "Option 2", value: 2, description: "Second choice" },
  { label: "Option 3", value: 3, description: "Third choice" },
];

const largeOptionsList = [
  { label: "Apple", value: "apple", description: "A red fruit" },
  { label: "Banana", value: "banana", description: "A yellow fruit" },
  { label: "Cherry", value: "cherry", description: "A small red fruit" },
  { label: "Date", value: "date", description: "A sweet brown fruit" },
  {
    label: "Elderberry",
    value: "elderberry",
    description: "A dark purple berry",
  },
  { label: "Fig", value: "fig", description: "A soft purple fruit" },
  { label: "Grape", value: "grape", description: "A small round fruit" },
  { label: "Honeydew", value: "honeydew", description: "A green melon" },
  { label: "Kiwi", value: "kiwi", description: "A fuzzy brown fruit" },
  { label: "Lemon", value: "lemon", description: "A sour yellow fruit" },
];
const searchValue = ref("");

const asyncOptionsLoader = async () => {
  // Simulate async loading
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    { label: "Async Option 1", value: "a1" },
    { label: "Async Option 2", value: "a2" },
    { label: "Async Option 3", value: "a3" },
  ];
};

const preselectedAsyncValue = ref("a2");

// Dummy operation to simulate refresh
const onRefresh = () => {
  return Promise.resolve(
    options.value.map((opt) => {
      opt.label = `${opt.label.split(" ")[0]} ${++counter.value}`;
      return opt;
    }),
  );
};
</script>

<template>
  <Story title="Forms/Dropdown" :layout="{ type: 'single', iframe: false }">
    <!-- Basic Usage -->
    <Variant title="Basic">
      <InkDropdown v-model="selectedValue" :options="options" />
    </Variant>

    <!-- [Feature] Refresh -->
    <Variant title="With Refresh">
      <InkDropdown v-model="selectedValue" v-model:options="options" :refresher="onRefresh" />
    </Variant>

    <!-- [Feature] Async Options -->
    <Variant title="Async Options">
      <InkDropdown v-model="asyncValue" :refresher="asyncOptionsLoader" />
    </Variant>

    <!-- [Feature] Options with Description -->
    <Variant title="With Descriptions">
      <InkDropdown v-model="selectedValue" :options="optionsWithDescription" />
    </Variant>

    <!-- [Feature] Preselected Async Value -->
    <Variant title="Preselected Async Value">
      <p>
        The dropdown should immediately load options and display "Async Option 2" instead of
        placeholder
      </p>
      <InkDropdown v-model="preselectedAsyncValue" :refresher="asyncOptionsLoader" />
    </Variant>

    <!-- [Feature] Stepping -->
    <Variant title="With Stepping">
      <InkDropdown v-model="selectedValue" :options="options" enable-stepping />
    </Variant>

    <!-- [Feature] Stepping & Refresh -->
    <Variant title="Stepping & Refresh">
      <InkDropdown
        v-model="selectedValue"
        v-model:options="options"
        :refresher="onRefresh"
        enable-stepping
      />
    </Variant>

    <!-- [Feature] Keyboard Navigation -->
    <Variant title="Keyboard Navigation">
      <p>
        Open the dropdown and use Arrow Up/Down to navigate options, Enter to select. Start typing
        to filter options (search matches both labels and descriptions). Press ESC to close.
      </p>
      <InkDropdown v-model="searchValue" :options="largeOptionsList" />
    </Variant>
  </Story>
</template>
