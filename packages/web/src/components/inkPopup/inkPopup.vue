<script setup lang="ts">
import { computed, ref } from "vue";
import { inkPopupProps, inkPopupEmits, type PopupPosition } from "./inkPopup";

import { useNativeDialog } from "../../composables/use-native-dialog";

defineOptions({ inheritAttrs: false });
const props = defineProps(inkPopupProps);
const emit = defineEmits(inkPopupEmits);

const open = defineModel<boolean>("open", { default: false });

const dialog = ref<HTMLDialogElement>();
useNativeDialog(dialog, open, () => props.scrim);
function requestClose() {
  if (props.closeOnEscape) open.value = false;
}
function onBackdropClick(event: MouseEvent) {
  if (!props.scrim || event.target !== dialog.value) return;
  const rect = dialog.value.getBoundingClientRect();
  const outside =
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom;
  if (outside) onScrimClick();
}
const positionClasses = computed(() => {
  const pos = props.position;
  if (typeof pos === "string") {
    return `ink-popup--${pos}`;
  }
  return "";
});

const positionStyles = computed(() => {
  const pos = props.position;
  if (!Array.isArray(pos)) {
    return {};
  }

  const [top, right, bottom, left] = pos;
  const styles: Record<string, string | number> = {};

  if (top !== undefined && top !== null) styles.top = `${top}px`;
  if (right !== undefined && right !== null) styles.right = `${right}px`;
  if (bottom !== undefined && bottom !== null) styles.bottom = `${bottom}px`;
  if (left !== undefined && left !== null) styles.left = `${left}px`;

  return styles;
});

const onScrimClick = () => {
  if (props.closeOnScrim) {
    open.value = false;
  }
  emit("scrim-click");
};
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialog"
      v-bind="$attrs"
      :aria-modal="scrim || undefined"
      :class="['ink-popup', positionClasses]"
      :style="positionStyles"
      @cancel.prevent="requestClose"
      @keydown.esc="
        (event) => {
          if (!scrim) {
            event.stopPropagation();
            requestClose();
          }
        }
      "
      @click="onBackdropClick"
      @close="
        () => {
          if (!dialog?.open) open = false;
        }
      "
    >
      <slot v-if="open" />
    </dialog>
  </Teleport>
</template>

<style lang="scss" scoped src="./inkPopup.scss" />
