<script setup lang="ts">
import { ref } from "vue";
import InkPopup from "../inkPopup/inkPopup.vue";
import InkButton from "../inkButton/inkButton.vue";
import { inkDoubleCheckProps, inkDoubleCheckEmits } from "./inkDoubleCheck";

const props = defineProps(inkDoubleCheckProps);
const emit = defineEmits(inkDoubleCheckEmits);

// --- data ---
const popupOpen = ref(false);

// --- methods ---
const onSlotClick = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
  popupOpen.value = true;
};

const onConfirm = () => {
  popupOpen.value = false;
  emit("confirm");
};

const onCancel = () => {
  popupOpen.value = false;
};
</script>

<template>
  <div class="ink-double-check">
    <div class="ink-double-check__trigger" @click="onSlotClick">
      <slot></slot>
    </div>

    <InkPopup v-model:open="popupOpen" position="center">
      <div class="ink-double-check__popup">
        <h3 class="ink-double-check__title">{{ title }}</h3>
        <p class="ink-double-check__message">{{ message }}</p>
        <div class="ink-double-check__actions">
          <InkButton :text="cancelText" theme="subtle" @click="onCancel" />
          <InkButton :text="confirmText" theme="danger" @click="onConfirm" />
        </div>
      </div>
    </InkPopup>
  </div>
</template>

<style lang="scss" scoped src="./inkDoubleCheck.scss" />
