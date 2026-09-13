<script setup lang="ts">
import { ref } from "vue";
import InkForm from "../../src/components/inkForm/inkForm.vue";
import InkButton from "../../src/components/inkButton/inkButton.vue";
import InkTextarea from "../../src/components/inkTextarea/inkTextarea.vue";
import InkDropdown from "../../src/components/inkDropdown/inkDropdown.vue";
import InkInput from "../../src/components/inkInput/inkInput.vue";

const width = ref(320);
const saved = ref(false);
const note = ref("普通说明使用 UI 字体；长内容允许换行。");
const location = ref("local");
const layout = ref<"col" | "row" | "inline">("col");
const formData = ref({
  name: "",
  email: "",
});
</script>

<template>
  <Story title="Forms/Form/[Semantic] Layouts" :layout="{ type: 'single', iframe: false }">
    <Variant title="Column Layout">
      <InkForm layout="col">
        <InkInput v-model="formData.name" label="Name" placeholder="Enter name" />
        <InkInput v-model="formData.email" label="Email" placeholder="Enter email" />
      </InkForm>
    </Variant>

    <Variant title="Inline Layout">
      <InkForm layout="inline">
        <InkInput v-model="formData.name" label="Name" placeholder="Enter name" />
        <InkInput v-model="formData.email" label="Email" placeholder="Enter email" />
      </InkForm>
    </Variant>
    <Variant title="Reactive layout">
      <select v-model="layout" aria-label="字段布局">
        <option>col</option>
        <option>row</option>
        <option>inline</option>
      </select>
      <InkForm :layout="layout"><InkInput v-model="formData.name" label="名称" /></InkForm>
    </Variant>
    <Variant title="长标签、错误与窄容器">
      <label>容器宽度 <input v-model="width" type="range" min="280" max="800" /></label>
      <section :style="{ width: width + 'px', maxWidth: '100%' }">
        <h1 class="font-title-lg">工作空间设置</h1>
        <p class="font-body-md">修改团队看到的工作空间名称。</p>
        <InkForm layout="col" @submit="saved = true">
          <InkInput
            v-model="formData.name"
            label="工作空间名称：请使用团队成员能够识别的名称 Workspace display name used by all team members"
            error="请输入有效名称。Use a descriptive name so teammates can identify this workspace."
          />
          <InkInput
            v-model="formData.email"
            :label="'workspace_identifier_' + 'abcdefghijklmnop'.repeat(4)"
          />
          <InkTextarea v-model:value="note" label="补充说明" />
          <InkDropdown
            v-model="location"
            label="保存位置"
            :options="[
              {
                value: 'local',
                label: '本地工作空间 Local workspace',
                description: '已选择的工作空间，将保存设置并同步后续任务。',
              },
            ]"
          />
          <InkButton theme="primary" native-type="submit" text="提交演示 Submit demonstration" />
          <p v-if="saved" class="font-body-sm text-feedback-success" role="status">
            已触发提交，演示不保存数据。
          </p>
        </InkForm>
      </section>
    </Variant>
  </Story>
</template>
