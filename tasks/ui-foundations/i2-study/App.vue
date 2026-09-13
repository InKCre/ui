<script setup>
import { computed, reactive, ref, watch } from "vue";
import { InkButton, InkInput, InkSwitch, InkDropdown, InkTooltip } from "@inkcre/ui-web";
import { sceneTokens } from "./palette.mjs";

const theme = ref("light");
watch(
  theme,
  (value) => {
    document.documentElement.dataset.theme = value;
  },
  { immediate: true },
);
const view = ref("scene");
const formState = ref("normal");
const feedbackKind = ref("warning");
const draft = reactive({ name: "阅读摘录", enabled: true, format: "text" });
const notice = ref("");
const busy = computed(() => formState.value === "pending");
const editable = computed(() => !["pending", "disabled"].includes(formState.value));
const panels = [
  { id: "current", title: "现行 · I1 产物", proposed: false },
  { id: "candidate", title: "候选 · 中性底面，清晰反馈", proposed: true },
];
const feedback = {
  normal: { title: "已连接", detail: "最近保存的正文与链接仍然可用。" },
  success: { title: "连接验证通过", detail: "现在可以继续采集，已有内容保持不变。" },
  warning: { title: "授权将在一天后到期", detail: "请在到期前重新授权，以免停止采集。" },
  info: {
    title: "下一次采集将包含附件",
    detail: "本次修改仅对之后的采集生效，已有记录保持不变。",
  },
  error: { title: "连接失败", detail: "请检查网络与授权后重试；已保存的内容仍然可读。" },
};
function save() {
  if (!draft.name.trim()) {
    formState.value = "error";
    return;
  }
  notice.value = `已在本页保留「${draft.name}」的设置。`;
}
function reset() {
  Object.assign(draft, { name: "阅读摘录", enabled: true, format: "text" });
  formState.value = "normal";
  notice.value = "";
}
</script>

<template>
  <main class="study" :data-view="view" :data-theme="theme">
    <header class="study-heading">
      <h1>色彩与阴影 · 场景校准</h1>
      <p>
        相同组件、内容与状态，只改变配色和阴影。候选尚未写入正式 Token；本页操作不保存业务数据。
      </p>
      <div class="study-controls">
        <label
          >主题<select v-model="theme" aria-label="主题">
            <option value="light">浅色</option>
            <option value="dark">深色</option>
          </select></label
        >
        <label
          >查看<select v-model="view" aria-label="查看">
            <option value="scene">页面场景</option>
            <option value="states">动作与反馈</option>
            <option value="layers">覆盖层阴影</option>
          </select></label
        >
        <label v-if="view === 'states'"
          >反馈情境<select v-model="feedbackKind" aria-label="反馈情境">
            <option value="normal">日常状态</option>
            <option value="success">刚完成连接验证</option>
            <option value="warning">授权即将到期</option>
            <option value="info">采集范围有变化</option>
            <option value="error">连接失败</option>
          </select></label
        >
        <label v-if="view === 'scene'"
          >表单状态<select v-model="formState" aria-label="表单状态">
            <option value="normal">正常</option>
            <option value="error">错误</option>
            <option value="pending">等待</option>
            <option value="disabled">不可用</option>
          </select></label
        >
      </div>
    </header>
    <div class="comparison">
      <section
        v-for="panel in panels"
        :key="panel.id"
        class="comparison-column"
        :aria-label="panel.title"
      >
        <h2 class="panel-label">{{ panel.title }}</h2>
        <article
          class="scene"
          :data-palette="panel.id"
          :style="{ ...sceneTokens(theme, panel.proposed), colorScheme: theme }"
        >
          <template v-if="view === 'scene'">
            <header class="scene-heading">
              <span class="brand">InKCre</span><span class="muted">来源</span>
            </header>
            <div class="scene-content">
              <h2>阅读与记录</h2>
              <p class="muted intro">收集值得保留的内容，继续上次的阅读。</p>
              <div class="source-row">
                <span>阅读摘录</span><span class="feedback muted">3 分钟前更新</span>
              </div>
              <div class="source-row">
                <span>每周通讯</span><span class="feedback muted">昨天更新</span>
              </div>
              <section class="settings">
                <h3>采集设置</h3>
                <InkInput
                  v-model="draft.name"
                  label="来源名称"
                  :editable="editable"
                  :error="formState === 'error' ? '请输入可辨认的来源名称。' : undefined"
                />
                <InkDropdown
                  v-model="draft.format"
                  label="保存内容"
                  :editable="editable"
                  :options="[
                    { label: '正文与链接', value: 'text' },
                    { label: '仅保留链接', value: 'link' },
                  ]"
                />
                <div class="switch-line">
                  <label :for="panel.id + '-sync'">自动采集</label
                  ><InkSwitch
                    :id="panel.id + '-sync'"
                    v-model="draft.enabled"
                    on-text="开启"
                    off-text="关闭"
                    :disabled="!editable"
                    :is-switching="busy"
                  />
                </div>
                <div class="actions">
                  <InkButton
                    text="保存设置"
                    theme="primary"
                    :is-loading="busy"
                    :disabled="!editable"
                    @click="save"
                  /><InkButton text="取消" theme="subtle" :disabled="!editable" @click="reset" />
                </div>
                <p v-if="busy" class="feedback muted" role="status">正在保存设置…</p>
                <p v-else-if="notice" class="feedback muted" role="status">{{ notice }}</p>
              </section>
            </div>
          </template>
          <div v-else-if="view === 'states'" class="scene-content">
            <h2>动作与反馈</h2>
            <p class="muted intro">可悬停、按下或用 Tab 聚焦。等待中的动作保留原配色和文字。</p>
            <section
              v-for="kind in ['primary', 'subtle', 'danger']"
              :key="kind"
              class="state-row"
              :data-kind="kind"
            >
              <h3>{{ { primary: "主要动作", subtle: "次要动作", danger: "危险动作" }[kind] }}</h3>
              <div class="actions">
                <InkButton
                  :theme="kind"
                  :text="kind === 'danger' ? '移除来源' : '执行操作'"
                  @click="notice = '已触发本页动作示意。'"
                /><InkButton :theme="kind" text="不可用" disabled /><InkButton
                  :theme="kind"
                  text="处理中"
                  is-loading
                />
              </div>
            </section>
            <section class="feedback-example" :data-feedback="feedbackKind">
              <p
                class="feedback feedback-title"
                :class="feedbackKind === 'normal' ? 'muted' : feedbackKind"
              >
                {{ feedback[feedbackKind].title }}
              </p>
              <p class="feedback feedback-detail">{{ feedback[feedbackKind].detail }}</p>
            </section>
            <p v-if="notice" class="muted" role="status">{{ notice }}</p>
          </div>
          <div v-else class="scene-content layers">
            <h2>覆盖关系</h2>
            <p class="muted intro">
              常驻内容不加阴影；提示覆盖内容时，用细边界和贴近轮廓的轻阴影区分。
            </p>
            <div class="tooltip-scene">
              <div class="source-row"><span>阅读摘录</span><span class="muted">最近更新</span></div>
              <div class="tooltip-anchor">
                <InkTooltip
                  content="重新连接后继续采集。"
                  position="bottom"
                  v-slot="{ describedby }"
                  ><InkButton text="连接说明" theme="subtle" :aria-describedby="describedby"
                /></InkTooltip>
              </div>
              <p class="muted covered-copy">最近保存的正文与链接仍然可用。</p>
            </div>
            <p class="muted layer-note">
              悬停或聚焦「连接说明」查看实际 Tooltip。下方并列展开三个阴影档位，便于比较范围。
            </p>
            <div class="shadow-examples">
              <div
                v-for="level in ['low', 'md', 'high']"
                :key="level"
                class="shadow-sample"
                :style="{
                  boxShadow: `var(--sys-elevation-raised-${level}-offset-x) var(--sys-elevation-raised-${level}-offset-y) var(--sys-elevation-raised-${level}-radius) var(--sys-elevation-raised-${level}-spread) var(--sys-elevation-raised-${level}-color)`,
                }"
              >
                {{ { low: "较弱", md: "默认", high: "较强" }[level] }}
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
    <footer>
      本页用于判断视觉力度；普通文字、必要边界、状态和焦点的可辨认性另行检查。键盘与配对结果见同目录记录。
    </footer>
  </main>
</template>

<style>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  background: #e9e9e9;
  color: #252525;
  font:
    16px/1.5 system-ui,
    sans-serif;
}
.study {
  max-width: 1300px;
  margin: auto;
  padding: 24px;
}
.study-heading h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 600;
}
.study-heading > p {
  margin: 8px 0 20px;
  max-width: 60em;
  color: #555;
}
.study-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  margin-bottom: 24px;
}
.study-controls label {
  display: flex;
  align-items: center;
  gap: 8px;
}
.study-controls select {
  color: #252525;
  background: #fff;
  border: 1px solid #777;
  border-radius: 0;
  font: inherit;
  padding: 5px 8px;
}
.study-controls select:focus-visible {
  outline: 2px solid #252525;
  outline-offset: 2px;
}
.comparison {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}
.comparison-column {
  min-width: 0;
}
.panel-label {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px;
}
.scene {
  min-height: 600px;
  color: var(--sys-color-text-base);
  background: var(--sys-color-surface-base);
  font-family: var(--sys-typo-family-sans);
  font-size: var(--sys-font-body-md-font-size);
  line-height: var(--sys-font-body-md-line-height);
}
.scene-heading {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid var(--sys-color-border-subtle);
  padding: 16px 24px;
}
.brand {
  font-family: var(--sys-typo-family-mono);
  font-size: var(--sys-font-title-sm-font-size);
  font-weight: var(--sys-font-title-sm-font-weight);
}
.scene-content {
  padding: 24px;
}
.scene h2 {
  margin: 0;
  font-size: var(--sys-font-title-lg-font-size);
  font-weight: var(--sys-font-title-lg-font-weight);
  line-height: var(--sys-font-title-lg-line-height);
}
.scene h3 {
  margin: 0;
  font-size: var(--sys-font-title-sm-font-size);
  font-weight: var(--sys-font-title-sm-font-weight);
  line-height: var(--sys-font-title-sm-line-height);
}
.scene p {
  margin: 0;
}
.scene .intro {
  margin: 8px 0 24px;
}
.muted {
  color: var(--sys-color-text-subtle);
}
.source-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 16px;
  padding: 12px 0;
  border-bottom: 1px solid var(--sys-color-border-subtle);
}
.source-row .feedback {
  font-size: var(--sys-font-body-sm-font-size);
}
.settings {
  display: grid;
  gap: 16px;
  margin-top: 28px;
  padding: 20px;
  background: var(--sys-color-surface-subtle);
}
.switch-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}
.switch-line > label {
  font-size: var(--sys-font-label-lg-font-size);
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.state-row {
  margin-block: 24px;
}
.state-row h3 {
  margin-bottom: 12px;
}
.feedback {
  font-size: var(--sys-font-body-sm-font-size);
  line-height: var(--sys-font-body-sm-line-height);
}
.success {
  color: var(--sys-color-feedback-success);
}
.warning {
  color: var(--sys-color-feedback-warning);
}
.info {
  color: var(--sys-color-feedback-info);
}
.error {
  color: var(--sys-color-feedback-error);
}
.feedback-example {
  margin-top: 24px;
  padding: 16px;
  background: var(--sys-color-surface-subtle);
}
.feedback-title {
  font-weight: 500;
}
.scene .feedback-detail {
  margin-top: 8px;
}
.tooltip-scene {
  position: relative;
  padding-bottom: 28px;
}
.tooltip-anchor {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
.tooltip-scene .ink-tooltip {
  width: max-content;
  max-width: 240px;
}
.tooltip-scene .covered-copy {
  margin-top: 24px;
}
.scene .layer-note {
  margin: 24px 0;
  font-size: var(--sys-font-body-sm-font-size);
}
.shadow-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  padding: 16px 0 32px;
}
.shadow-sample {
  padding: 12px 20px;
  background: var(--sys-color-surface-base);
  border: 1px solid var(--sys-color-border-base);
  font-size: var(--sys-font-body-sm-font-size);
}
.study footer {
  margin-top: 20px;
  color: #555;
  font-size: 13px;
}
@media (max-width: 760px) {
  .study {
    padding: 20px 12px;
  }
  .comparison {
    grid-template-columns: 1fr;
  }
  .scene-heading,
  .scene-content {
    padding: 20px;
  }
  .settings {
    padding: 16px;
  }
}
</style>
