<script setup lang="ts">
import { ref } from "vue";
import InkDialog from "../../src/components/inkDialog/inkDialog.vue";
import InkButton from "../../src/components/inkButton/inkButton.vue";

const basicDialog = ref(false);
const withSlotsDialog = ref(false);
const asyncDialog = ref<boolean | Promise<boolean>>(false);
const loadingDialog = ref(false);
const loadingPending = ref(false);
const customPending = ref(false);
const customError = ref("");
const failNext = ref(true);
const asyncError = ref("");
const failPromise = ref(false);

const handleAsyncConfirm = () => {
  asyncError.value = "";
  asyncDialog.value = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (failPromise.value) reject(new Error("保存失败，请重试。"));
      else resolve(false);
    }, 2000);
  });
};

const handleLoadingConfirm = () => {
  loadingPending.value = true;
  setTimeout(() => {
    loadingPending.value = false;
    loadingDialog.value = false;
  }, 2000);
};

const handleCustomConfirm = async () => {
  if (customPending.value) return;
  customPending.value = true;
  customError.value = "";
  await new Promise((resolve) => setTimeout(resolve, 2000));
  if (failNext.value) customError.value = "保存失败；输入已保留，请重试。";
  else withSlotsDialog.value = false;
  customPending.value = false;
};
</script>

<template>
  <Story title="Feedback/Dialog" :layout="{ type: 'single', iframe: false }">
    <Variant title="Basic">
      <InkButton text="Open Dialog" theme="primary" @click="basicDialog = true" />
      <InkDialog v-model="basicDialog" title="Dialog Title" subtitle="This is a subtitle">
        <p>This is the dialog content.</p>
      </InkDialog>
    </Variant>

    <Variant title="Custom footer failure and retry">
      <InkButton text="Open Dialog" theme="primary" @click="withSlotsDialog = true" />
      <InkDialog
        v-model="withSlotsDialog"
        title="编辑配置"
        :is-loading="customPending"
        @confirm="handleCustomConfirm"
      >
        <label>名称 <input value="保留这份草稿" /></label>
        <label style="display: block"
          ><input v-model="failNext" type="checkbox" :disabled="customPending" />模拟保存失败</label
        >
        <p v-if="customError" role="alert">{{ customError }}</p>
        <template #footer="{ cancel, confirm, isLoading }">
          <InkButton text="取消" @click="cancel" />
          <InkButton text="保存" theme="primary" :is-loading="isLoading" @click="confirm" />
        </template>
      </InkDialog>
    </Variant>

    <Variant title="Async">
      <label><input v-model="failPromise" type="checkbox" />模拟 Promise 失败</label>
      <InkButton text="Open Async Dialog" theme="primary" @click="asyncDialog = true" />
      <InkDialog
        v-model="asyncDialog"
        title="Async Dialog"
        subtitle="等待两秒；模拟失败时保留弹窗"
        @confirm="handleAsyncConfirm"
        @error="asyncError = $event instanceof Error ? $event.message : '保存失败'"
      >
        <p>Click confirm to see loading state.</p>
        <p v-if="asyncError" role="alert">{{ asyncError }}</p>
      </InkDialog>
    </Variant>

    <Variant title="Without Cancel">
      <InkButton text="Open Dialog" theme="primary" @click="loadingDialog = true" />
      <InkDialog
        v-model="loadingDialog"
        title="Confirm Action"
        :show-cancel="false"
        :is-loading="loadingPending"
        @confirm="handleLoadingConfirm"
      >
        <p>This dialog only has a confirm button.</p>
      </InkDialog>
    </Variant>
  </Story>
</template>
