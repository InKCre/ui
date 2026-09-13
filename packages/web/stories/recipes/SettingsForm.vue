<script setup lang="ts">
import { ref } from "vue";
import { InkForm, InkInput, InkButton } from "@inkcre/ui-web";
// 宿主提供实际持久化函数，失败时 reject。
const props = defineProps<{ save: (name: string) => Promise<void> }>();
const name = ref(""),
  error = ref(""),
  result = ref(""),
  pending = ref(false);
async function submit() {
  if (pending.value) return;
  error.value = name.value.trim() ? "" : "请输入名称。";
  result.value = "";
  if (error.value) return;
  pending.value = true;
  try {
    await props.save(name.value.trim());
    result.value = "设置已保存。";
  } catch {
    error.value = "保存失败，请稍后重试。";
  } finally {
    pending.value = false;
  }
}
</script>
<template>
  <section class="settings-form">
    <h1 class="title">工作空间设置</h1>
    <p class="copy">修改团队看到的工作空间名称。</p>
    <InkForm layout="col" @submit="submit">
      <InkInput
        v-model="name"
        label="名称"
        name="workspace"
        :error="error"
        :disabled="pending"
        required
      />
      <InkButton theme="primary" native-type="submit" text="保存设置" :is-loading="pending" />
      <p v-if="result" role="status" class="feedback">{{ result }}</p>
    </InkForm>
  </section>
</template>
<style scoped>
.settings-form {
  font-family: var(--sys-typo-family-sans);
  color: var(--sys-color-text-base);
}
.title {
  font-size: var(--sys-font-title-lg-font-size);
  line-height: var(--sys-font-title-lg-line-height);
  font-weight: var(--sys-font-title-lg-font-weight);
  letter-spacing: var(--sys-font-title-lg-letter-spacing);
}
.copy {
  font-size: var(--sys-font-body-md-font-size);
  line-height: var(--sys-font-body-md-line-height);
  font-weight: var(--sys-font-body-md-font-weight);
  letter-spacing: var(--sys-font-body-md-letter-spacing);
}
.feedback {
  font-size: var(--sys-font-body-sm-font-size);
  line-height: var(--sys-font-body-sm-line-height);
  font-weight: var(--sys-font-body-sm-font-weight);
  letter-spacing: var(--sys-font-body-sm-letter-spacing);
  color: var(--sys-color-feedback-success);
}
</style>
