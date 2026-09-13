<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { InkForm, InkJsonEditor, InkButton, type JsonEditorValidation } from "@inkcre/ui-web";

const props = defineProps<{ save: (value: unknown) => Promise<void> }>();
const draft = ref('{"name":"工作空间"}');
const validation = ref<JsonEditorValidation | null>(null);
const pending = ref(false);
const message = ref("");
const schema = { type: "object", properties: { name: { type: "string" } }, required: ["name"] };
const canSave = computed(
  () => validation.value?.status === "valid" && validation.value.text === draft.value,
);

watch(
  draft,
  () => {
    validation.value = null;
    message.value = "";
  },
  { flush: "sync" },
);
async function submit() {
  if (pending.value || !canSave.value) return;
  pending.value = true;
  try {
    await props.save(JSON.parse(draft.value));
    message.value = "配置已保存。";
  } catch {
    message.value = "保存失败，请检查配置并重试。";
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <InkForm @submit="submit">
    <InkJsonEditor
      v-model="draft"
      label="配置 JSON"
      :schema="schema"
      :disabled="pending"
      @validation="validation = $event"
      @error="message = '校验暂不可用，请稍后重试。'"
    />
    <InkButton
      text="保存配置"
      theme="primary"
      native-type="submit"
      :is-loading="pending"
      :disabled="!canSave"
    />
    <p v-if="message" role="status">{{ message }}</p>
  </InkForm>
</template>
