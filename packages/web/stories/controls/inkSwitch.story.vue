<script setup lang="ts">
import { ref } from "vue";
import InkSwitch from "../../src/components/inkSwitch/inkSwitch.vue";

const switchMd = ref(false);
</script>

<template>
  <Story title="Controls/Switch" :layout="{ type: 'grid', width: '200px' }">
    <!-- [Semantic] Sizes -->
    <Variant title="Extra Small">
      <InkSwitch v-model="switchMd" size="xs" label="Enable" />
    </Variant>

    <Variant title="Small">
      <InkSwitch v-model="switchMd" size="sm" label="Feature" />
    </Variant>

    <Variant title="Medium">
      <InkSwitch v-model="switchMd" size="md" label="Setting" />
    </Variant>

    <Variant title="Large">
      <InkSwitch v-model="switchMd" size="lg" label="Option" />
    </Variant>

    <!-- [State] Toggle States -->
    <Variant title="Off">
      <InkSwitch :modelValue="false" size="md" label="Disabled" />
    </Variant>

    <Variant title="On">
      <InkSwitch :modelValue="true" size="md" label="Enabled" />
    </Variant>
  </Story>
</template>
