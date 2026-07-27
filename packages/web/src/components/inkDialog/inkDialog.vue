<script setup lang="ts">
import { ref, computed, watch, provide, readonly } from "vue";
import {
  inkDialogProps,
  inkDialogEmits,
  type DialogPosition,
} from "./inkDialog";
import InkButton from "../inkButton/inkButton.vue";
import InkPopup from "../inkPopup/inkPopup.vue";
import { useOptionalI18n } from "../../i18n";

const props = defineProps(inkDialogProps);
const emit = defineEmits(inkDialogEmits);
const i18n = useOptionalI18n();

const currentValue = ref(false);
const isPromiseLoading = ref(false);

const updateCurrentValue = async (value: boolean | Promise<boolean>) => {
  if (value instanceof Promise) {
    isPromiseLoading.value = true;
    try {
      currentValue.value = await value;
    } finally {
      isPromiseLoading.value = false;
    }
  } else {
    currentValue.value = value;
  }
};

watch(
  () => props.modelValue,
  (val) => {
    updateCurrentValue(val);
  },
  { immediate: true }
);

const open = computed({
  get: () => currentValue.value,
  set: (val: boolean) => {
    emit("update:modelValue", val);
  },
});

const isLoading = computed(() => isPromiseLoading.value);

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
    emit("cancel");
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
    v-model:open="open"
    :position="props.position"
    :close-on-scrim="props.closeOnScrim"
  >
    <div class="ink-dialog">
      <div v-if="$slots.header || title || subtitle" class="ink-dialog__header">
        <slot name="header">
          <h2 v-if="title" class="ink-dialog__title">{{ title }}</h2>
          <p v-if="subtitle" class="ink-dialog__subtitle">{{ subtitle }}</p>
        </slot>
      </div>

      <div class="ink-dialog__content">
        <slot
          :cancel="handleCancel"
          :confirm="handleConfirm"
          :isLoading="isLoading"
        ></slot>
      </div>

      <div
        v-if="$slots.footer || showCancel || showConfirm"
        class="ink-dialog__footer"
      >
        <slot name="footer">
          <InkButton
            v-if="showCancel"
            :text="cCancelText"
            theme="subtle"
            @click="handleCancel"
          />
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
