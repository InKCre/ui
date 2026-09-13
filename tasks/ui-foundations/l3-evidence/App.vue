<script setup lang="ts">
import { ref } from "vue";
import SettingsForm from "./SettingsForm.vue";
import HostIntegration from "./HostIntegration.vue";
import JsonConfiguration from "./JsonConfiguration.vue";
const fail = ref(false),
  locale = ref("en"),
  currentName = ref("设置");
async function save() {
  await new Promise((done) => setTimeout(done, 500));
  if (fail.value) throw new Error("模拟失败");
}
function translate(key: string) {
  return key === "dialog.confirm" ? (locale.value === "en" ? "Confirm" : "确认") : key;
}
</script>
<template>
  <main>
    <label><input v-model="fail" type="checkbox" />模拟保存失败</label>
    <button @click="locale = locale === 'en' ? 'zh-CN' : 'en'">切换语言</button>
    <button @click="currentName = '扩展'">切换路由</button>
    <section id="settings"><SettingsForm :save="save" /></section>
    <section id="integration">
      <HostIntegration
        current-path="/settings"
        :current-name="currentName"
        :locale="locale"
        :translate="translate"
      />
    </section>
    <section id="json"><JsonConfiguration :save="save" /></section>
  </main>
</template>
<style>
body {
  margin: 0;
  background: var(--sys-color-surface-base);
  color: var(--sys-color-text-base);
  font-family: var(--sys-typo-family-sans);
}
main {
  max-width: 480px;
  margin: auto;
  padding: 16px;
}
section {
  margin-block: 24px;
}
</style>
