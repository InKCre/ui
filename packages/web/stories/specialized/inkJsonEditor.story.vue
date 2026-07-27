<script setup lang="ts">
import { ref } from "vue";
import InkJsonEditor from "../../src/components/inkJsonEditor/inkJsonEditor.vue";
import InkPopup from "../../src/components/inkPopup/inkPopup.vue";

const show = ref(false);

const jsonData = ref(
  JSON.stringify(
    {
      name: "InKCre Design System",
      version: "1.0.0",
      components: ["inkButton", "inkForm", "inkLoading", "inkJsonEditor"],
    },
    null,
    2,
  ),
);

const jsonSchema = ref({
  type: "object",
  properties: {
    name: { type: "string" },
    version: { type: "string" },
    components: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["name", "version", "components"],
});
</script>

<template>
  <Story title="Specialized/JsonEditor" :layout="{ iframe: false, type: 'single' }">
    <Variant title="Basic">
      <InkJsonEditor v-model="jsonData" />
    </Variant>
    <Variant title="JSON Schema">
      <InkJsonEditor v-model="jsonData" :schema="jsonSchema" />
    </Variant>
    <Variant title="In popup">
      <button @click="show = true">Open JSON Editor</button>
      <InkPopup v-model:open="show" position="center">
        <div style="width: 500px; height: 300px">
          <div style="background: yellow; height: 20px"></div>
          <InkJsonEditor v-model="jsonData" />
          <div style="background: yellow; height: 20px"></div>
        </div>
        <button @click="show = false">Close</button>
      </InkPopup>
    </Variant>
  </Story>
</template>
