<script setup lang="ts">
import { onUnmounted, watch } from "vue";
import { inkScrimProps, inkScrimEmits } from "./inkScrim";
import inkButton from "../inkButton/inkButton.vue";

const props = defineProps(inkScrimProps);
const emit = defineEmits(inkScrimEmits);

const open = defineModel<boolean>("open", { default: false });

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

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape" && props.closeOnEscape) {
    close();
  }
};

watch(
  open,
  (newVal) => {
    if (newVal) {
      document.addEventListener("keydown", handleEscape);
    } else {
      document.removeEventListener("keydown", handleEscape);
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="ink-scrim-fade">
      <div
        v-if="open"
        class="ink-scrim"
        data-testid="ink-scrim"
        @click="onScrimClick"
      >
        <div class="ink-scrim__wrapper">
          <div class="ink-scrim__close-btn" @click.stop>
            <inkButton
              v-if="props.showCloseButton"
              data-testid="ink-scrim-close-btn"
              aria-label="Close"
              @click="close"
              type="square"
              icon="i-mdi-close"
            >
            </inkButton>
          </div>
          <slot :close="close" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped src="./inkScrim.scss"></style>
