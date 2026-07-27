<script setup lang="ts">
import { ref } from "vue";
import InkPicker from "../../src/components/inkPicker/inkPicker.vue";

const selectedDate = ref(null);
</script>

<template>
  <Story title="Forms/Picker" :layout="{ type: 'single', iframe: false }">
    <!-- [Semantic] Date Selection -->
    <Variant title="Date Picker">
      <InkPicker v-model="selectedDate" label="Select Date" type="date" layout="col" />
    </Variant>

    <!-- [State] Required -->
    <Variant title="Required Field">
      <InkPicker
        v-model="selectedDate"
        label="Birth Date"
        type="date"
        :required="true"
        layout="col"
      />
    </Variant>
  </Story>
</template>
