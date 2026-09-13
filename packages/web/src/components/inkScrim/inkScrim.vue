<script setup lang="ts">
import { ref } from "vue";
import { inkScrimProps, inkScrimEmits } from "./inkScrim";
import InkButton from "../inkButton/inkButton.vue";
import { useNativeDialog } from "../../composables/use-native-dialog";

defineOptions({ inheritAttrs: false });
const props = defineProps(inkScrimProps);
const emit = defineEmits(inkScrimEmits);
const open = defineModel<boolean>("open", { default: false });
const dialog = ref<HTMLDialogElement>();
useNativeDialog(dialog, open, () => true);

const onScrimClick = () => {
  if (props.closeOnScrim) {
    close();
  }
  emit("scrim-click");
};

const close = () => {
  emit("close");
  open.value = false;
};
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialog"
      v-bind="$attrs"
      class="ink-scrim"
      aria-modal="true"
      data-testid="ink-scrim"
      @click.self="onScrimClick"
      @cancel.prevent="closeOnEscape && close()"
      @close="
        () => {
          if (!dialog?.open && open) close();
        }
      "
    >
      <div v-if="open" class="ink-scrim__wrapper" @click.self="onScrimClick">
        <div v-if="showCloseButton" class="ink-scrim__close-btn">
          <InkButton
            data-testid="ink-scrim-close-btn"
            aria-label="Close"
            @click="close"
            type="square"
            icon="i-mdi-close"
          />
        </div>
        <slot :close="close" />
      </div>
    </dialog>
  </Teleport>
</template>

<style lang="scss" scoped src="./inkScrim.scss"></style>
