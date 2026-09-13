<script setup lang="ts">
import { computed, provide, readonly, useId } from "vue";
import { inkDialogProps, inkDialogEmits, type DialogPosition } from "./inkDialog";
import InkButton from "../inkButton/inkButton.vue";
import InkPopup from "../inkPopup/inkPopup.vue";
import { useOptionalI18n } from "../../i18n";

import { useAsyncBoolean } from "../../composables/use-async-boolean";

const props = defineProps(inkDialogProps);
const emit = defineEmits(inkDialogEmits);
const i18n = useOptionalI18n();

const titleId = useId();
const { value: currentValue, pending } = useAsyncBoolean(
  () => props.modelValue,
  (error) => emit("error", error),
);
const isLoading = computed(() => props.isLoading || pending.value);
const open = computed({
  get: () => currentValue.value,
  set: (value: boolean) => {
    if (isLoading.value) return;
    if (!value) emit("cancel");
    emit("update:modelValue", value);
  },
});

// Provide loading state to buttons via inject
provide("isLoading", readonly(isLoading));

const cCancelText = computed(() => {
  if (props.cancelText) return props.cancelText;
  return i18n ? i18n.t("dialog.cancel") : "Cancel";
});

const cConfirmText = computed(() => {
  if (props.confirmText) return props.confirmText;
  return i18n ? i18n.t("dialog.confirm") : "Confirm";
});

const handleCancel = () => {
  if (!isLoading.value) {
    open.value = false;
  }
};

const handleConfirm = () => {
  if (!isLoading.value) {
    emit("confirm");
  }
};
</script>

<template>
  <InkPopup
    class="ink-dialog__popup"
    v-model:open="open"
    :position="props.position"
    :close-on-scrim="props.closeOnScrim && !isLoading"
    :close-on-escape="!isLoading"
    :aria-labelledby="title ? titleId : undefined"
    :aria-busy="isLoading || undefined"
  >
    <div class="ink-dialog">
      <div v-if="$slots.header || title || subtitle" class="ink-dialog__header">
        <slot name="header">
          <h2 v-if="title" :id="titleId" class="ink-dialog__title">{{ title }}</h2>
          <p v-if="subtitle" class="ink-dialog__subtitle">{{ subtitle }}</p>
        </slot>
      </div>

      <div class="ink-dialog__content">
        <slot :cancel="handleCancel" :confirm="handleConfirm" :isLoading="isLoading"></slot>
      </div>

      <div v-if="$slots.footer || showCancel || showConfirm" class="ink-dialog__footer">
        <slot name="footer">
          <InkButton v-if="showCancel" :text="cCancelText" theme="subtle" @click="handleCancel" />
          <InkButton
            v-if="showConfirm"
            :text="cConfirmText"
            theme="primary"
            @click="handleConfirm"
          />
        </slot>
      </div>
    </div>
  </InkPopup>
</template>

<style lang="scss" scoped src="./inkDialog.scss" />
