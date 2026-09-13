<script setup lang="ts">
import { computed, provide, ref } from "vue";
import {
  INK_ROUTER_KEY,
  INK_I18N_KEY,
  InkHeader,
  InkDialog,
  InkButton,
  type InkRouter,
  type InkI18n,
} from "@inkcre/ui-web";

const props = defineProps<{
  currentPath: string;
  currentName: string | null;
  locale: string;
  translate: (key: string) => string;
}>();
provide<InkRouter>(INK_ROUTER_KEY, {
  currentPath: computed(() => props.currentPath),
  currentName: computed(() => props.currentName),
});
provide<InkI18n>(INK_I18N_KEY, {
  t: (key) => props.translate(key),
  locale: computed(() => props.locale),
});
const open = ref(false);
function setTheme(event: Event) {
  const value = (event.target as HTMLSelectElement).value;
  document.documentElement.dataset.theme = value;
}
</script>

<template>
  <InkHeader />
  <label>
    主题
    <select aria-label="主题" @change="setTheme">
      <option value="system">跟随系统</option>
      <option value="light">浅色</option>
      <option value="dark">深色</option>
    </select>
  </label>
  <InkButton text="查看设置说明" @click="open = true" />
  <InkDialog v-model="open" title="设置说明" :show-cancel="false" @confirm="open = false">
    当前页面：{{ currentName }}。弹层使用根级主题，按钮文案通过语言适配器读取。
  </InkDialog>
</template>
