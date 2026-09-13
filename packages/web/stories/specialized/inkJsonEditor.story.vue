<script setup lang="ts">
import InkButton from "../../src/components/inkButton/inkButton.vue";
import type { JsonEditorValidation } from "../../src/index";
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
const firstSchema = {
  type: "object",
  properties: { count: { type: "integer" } },
  required: ["count"],
};
const secondSchema = {
  type: "object",
  properties: { name: { type: "string" } },
  required: ["name"],
};
const firstDraft = ref('{"count":0}');
const secondDraft = ref('{"name":"existing"}');
const result = ref<JsonEditorValidation>();
const saved = ref("尚未保存");
function saveDraft() {
  if (result.value?.valid && result.value.text === firstDraft.value)
    saved.value = JSON.stringify(JSON.parse(firstDraft.value));
}
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
    <Variant title="Validated save and isolated editors">
      <InkJsonEditor
        v-model="firstDraft"
        label="数字配置"
        :schema="firstSchema"
        @validation="result = $event"
      />
      <InkJsonEditor v-model="secondDraft" label="名称配置" :schema="secondSchema" />
      <InkButton
        text="保存数字配置"
        :disabled="!result?.valid || result.text !== firstDraft"
        @click="saveDraft"
      />
      <p>状态：{{ result?.status }}；已保存：{{ saved }}</p>
    </Variant>
  </Story>
</template>
