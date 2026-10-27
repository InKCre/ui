<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { inkContentReaderProps, readingDocument } from "./inkContentReader";
import { useOptionalI18n } from "../../i18n";
import en from "../../locales/en";

const props = defineProps(inkContentReaderProps);
const i18n = useOptionalI18n();
const title = computed(() => (i18n ? i18n.t("contentReader.title") : en.contentReader.title));
const document = computed(() => readingDocument(props.content, props.format));
const frame = ref<HTMLIFrameElement>();
const height = ref(160);
let observer: ResizeObserver | undefined;
function measure() {
  observer?.disconnect();
  const body = frame.value?.contentDocument?.body;
  if (!body) return;
  const resize = () => {
    height.value = Math.ceil(body.getBoundingClientRect().height) + 24;
  };
  resize();
  observer = new ResizeObserver(resize);
  observer.observe(body);
}
onBeforeUnmount(() => observer?.disconnect());
</script>
<template>
  <iframe
    ref="frame"
    class="ink-content-reader"
    :title="title"
    :srcdoc="document"
    :style="{ height: `${height}px` }"
    sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
    referrerpolicy="no-referrer"
    @load="measure"
  />
</template>
<style lang="scss" scoped src="./inkContentReader.scss" />
