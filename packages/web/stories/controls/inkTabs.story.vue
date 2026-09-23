<script setup lang="ts">
import { ref } from "vue";
import InkTabs from "../../src/components/inkTabs/inkTabs.vue";
const selected = ref("visual");
const tabs = [
  { value: "visual", label: "Visual" },
  { value: "json", label: "JSON" },
];
</script>

<template>
  <Story title="Controls/Tabs" :layout="{ type: 'single', iframe: false }">
    <Variant title="Controlled tabs">
      <InkTabs v-model="selected" :tabs="tabs" label="Configuration view" />
      <p>{{ selected }}</p>
    </Variant>
  </Story>
</template>
