<script setup>
import { ref, watch } from "vue";
import {
  InkButton,
  InkInput,
  InkDropdown,
  InkSwitch,
  InkTooltip,
  InkPopup,
  InkScrim,
} from "@inkcre/ui-web";

const theme = ref("light");
watch(
  theme,
  (value) => {
    document.documentElement.dataset.theme = value;
  },
  { immediate: true },
);
const name = ref("");
const format = ref("text");
const enabled = ref(true);
const popupOpen = ref(false);
const scrimOpen = ref(false);
</script>

<template>
  <main class="delivery">
    <header>
      <h1>I2 · 实际产物验收</h1>
      <p>本页使用打包产物的根级主题，检查组件状态、浮层和样式入口。</p>
      <label
        >主题
        <select v-model="theme" aria-label="主题">
          <option value="light">浅色</option>
          <option value="dark">深色</option>
        </select></label
      >
    </header>
    <section class="controls">
      <h2>采集设置</h2>
      <InkInput
        v-model="name"
        label="来源名称"
        :error="name.trim() ? undefined : '请输入来源名称。'"
      />
      <InkDropdown
        v-model="format"
        label="保存内容"
        :options="[
          { value: 'text', label: '正文与链接', description: '保留全文，便于继续阅读。' },
          { value: 'link', label: '仅保留链接', description: '在原始页面打开完整内容。' },
        ]"
      />
      <div class="row">
        <label for="sync">自动采集</label
        ><InkSwitch id="sync" v-model="enabled" on-text="开启" off-text="关闭" />
      </div>
    </section>
    <section class="actions">
      <div
        v-for="kind in ['primary', 'subtle', 'danger']"
        :key="kind"
        class="row"
        :data-kind="kind"
      >
        <InkButton
          :theme="kind"
          :text="{ primary: '保存设置', subtle: '取消修改', danger: '移除来源' }[kind]"
        />
        <InkButton :theme="kind" text="不可用" disabled />
        <InkButton :theme="kind" text="处理中" is-loading />
      </div>
    </section>
    <section class="row overlay-actions">
      <InkButton text="打开确认" theme="subtle" @click="popupOpen = true" />
      <InkButton text="打开阅读层" theme="subtle" @click="scrimOpen = true" />
      <InkTooltip content="重新连接后继续采集。" position="top" v-slot="{ describedby }">
        <InkButton text="连接说明" theme="subtle" :aria-describedby="describedby" />
      </InkTooltip>
    </section>
    <section class="shadow-grid">
      <template v-for="level in ['low', 'md', 'high']" :key="level">
        <div class="shadow-sample" :class="`sass-shadow-${level}`">Sass · {{ level }}</div>
        <div class="shadow-sample" :class="`shadow-${level}`">Uno · {{ level }}</div>
      </template>
    </section>
    <p class="uno-pair bg-surface-primary text-text-on-primary">Uno 主动作配对</p>
    <InkPopup v-model:open="popupOpen" aria-label="设置确认">
      <h2>移除阅读摘录？</h2>
      <p>停止后续采集，已经保存的内容仍可阅读。</p>
      <div class="row">
        <InkButton theme="danger" text="移除来源" @click="popupOpen = false" /><InkButton
          theme="subtle"
          text="返回设置"
          @click="popupOpen = false"
        />
      </div>
    </InkPopup>
    <InkScrim v-model:open="scrimOpen" aria-label="阅读内容" show-close-button>
      <article class="scrim-content">
        <h2>阅读摘录</h2>
        <p>当前内容保持完整，关闭后回到原来的采集设置。</p>
      </article>
    </InkScrim>
  </main>
</template>

<style>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  color: var(--sys-color-text-base);
  background: var(--sys-color-surface-base);
  font-family: var(--sys-typo-family-sans);
  font-size: var(--sys-font-body-md-font-size);
  line-height: var(--sys-font-body-md-line-height);
}
.delivery {
  max-width: 760px;
  margin: auto;
  padding: 24px;
}
h1 {
  font-size: var(--sys-font-title-lg-font-size);
  font-weight: 500;
}
h2 {
  font-size: var(--sys-font-title-sm-font-size);
  font-weight: 500;
}
header {
  margin-bottom: 28px;
}
header p {
  color: var(--sys-color-text-subtle);
}
header select {
  font: inherit;
  color: inherit;
  background: var(--sys-color-surface-base);
  border: 1px solid var(--sys-color-border-base);
  border-radius: 0;
}
.controls {
  display: grid;
  gap: 16px;
  padding: 20px;
  background: var(--sys-color-surface-subtle);
}
.controls h2 {
  margin: 0;
}
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
.actions {
  display: grid;
  gap: 16px;
  margin: 24px 0;
}
.overlay-actions {
  margin-block: 28px;
}
.shadow-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
.shadow-sample {
  padding: 12px;
  border: 1px solid var(--sys-color-border-base);
  background: var(--sys-color-surface-base);
}
.uno-pair {
  padding: 12px;
}
.ink-popup p {
  margin-block: 16px;
}
.ink-tooltip {
  width: max-content;
  max-width: 200px;
}
.scrim-content {
  width: min(420px, calc(100vw - 48px));
  margin: 20vh auto;
  padding: 20px;
  color: var(--sys-color-text-base);
  background: var(--sys-color-surface-base);
}
.scrim-content h2 {
  margin-top: 0;
}
@media (max-width: 480px) {
  .delivery {
    padding: 16px;
  }
  .controls {
    padding: 16px;
  }
}
</style>
