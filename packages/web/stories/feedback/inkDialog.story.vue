<script setup lang="ts">
import { ref } from "vue";
import InkDialog from "../../src/components/inkDialog/inkDialog.vue";
import InkButton from "../../src/components/inkButton/inkButton.vue";

const basicDialog = ref(false);
const withSlotsDialog = ref(false);
const asyncDialog = ref<boolean | Promise<boolean>>(false);
const loadingDialog = ref(false);

const handleAsyncConfirm = () => {
  asyncDialog.value = new Promise((resolve) => {
    setTimeout(() => {
      resolve(false);
    }, 2000);
  });
};

const handleLoadingConfirm = () => {
  loadingDialog.value = true;
  setTimeout(() => {
    loadingDialog.value = false;
  }, 2000);
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

    <Variant title="with Custom Slots">
      <InkButton text="Open Dialog" theme="primary" @click="withSlotsDialog = true" />
      <InkDialog v-model="withSlotsDialog" title="Custom Dialog">
        <template #default="{ cancel, confirm, isLoading }">
          <div style="padding: 20px">
            <p>Are you sure you want to proceed?</p>
            <p v-if="isLoading">Processing...</p>
            <div style="display: flex; gap: 10px; margin-top: 10px">
              <InkButton text="No" theme="subtle" @click="cancel" />
              <InkButton text="Yes" theme="primary" @click="confirm" />
            </div>
          </div>
        </template>
      </InkDialog>
    </Variant>

    <Variant title="Async">
      <InkButton text="Open Async Dialog" theme="primary" @click="asyncDialog = true" />
      <InkDialog
        v-model="asyncDialog"
        title="Async Dialog"
        subtitle="This will close after 2 seconds"
        @confirm="handleAsyncConfirm"
      >
        <p>Click confirm to see loading state.</p>
      </InkDialog>
    </Variant>

    <Variant title="Without Cancel">
      <InkButton text="Open Dialog" theme="primary" @click="loadingDialog = true" />
      <InkDialog
        v-model="loadingDialog"
        title="Confirm Action"
        :show-cancel="false"
        @confirm="handleLoadingConfirm"
      >
        <p>This dialog only has a confirm button.</p>
      </InkDialog>
    </Variant>
  </Story>
</template>
