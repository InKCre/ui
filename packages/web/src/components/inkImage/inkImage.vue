<script setup lang="ts">
import { computed } from "vue";
import {
  inkImageProps,
  inkImageEmits,
  type InkImageErrorPayload,
} from "./inkImage";
import InkScrim from "../inkScrim/inkScrim.vue";
import { useOptionalModel } from "../../composables/use-optional-model";

const props = defineProps(inkImageProps);
const emit = defineEmits(inkImageEmits);

const expanded = useOptionalModel({
  props,
  emit,
  modelName: "expanded",
  defaultValue: false,
});

// --- Computed ---

const lazyLoadAttr = computed(() => {
  return props.lazy ? { loading: "lazy" as const } : {};
});

// --- Methods ---

const handleThumbnailClick = () => {
  expanded.value = true;
  emit("expand");
};

const handleClose = () => {
  emit("close");
};

const handleImageError = (error: Event) => {
  const payload: InkImageErrorPayload = {
    error,
    src: props.src,
  };
  emit("error", payload);
};
</script>

<template>
  <div class="ink-image">
    <!-- Thumbnail -->
    <div
      class="ink-image__thumbnail"
      data-testid="ink-image-thumbnail"
      @click="handleThumbnailClick"
    >
      <slot name="thumbnail">
        <img
          :src="props.src"
          :alt="props.alt"
          :title="props.title"
          v-bind="lazyLoadAttr"
          class="ink-image__img"
          data-testid="ink-image-img"
          @error="handleImageError"
        />
      </slot>
    </div>

    <!-- Scrim overlay with expanded view content -->
    <InkScrim
      v-model:open="expanded"
      :close-on-scrim="true"
      :show-close-button="true"
      @close="handleClose"
    >
      <div class="ink-image__expanded" data-testid="ink-image-expanded">
        <!-- Header -->
        <div
          class="ink-image__expanded-header"
          v-if="$slots['expanded-header']"
        >
          <slot name="expanded-header"> </slot>
        </div>

        <!-- Image - maintains aspect ratio and fills available space -->
        <img
          @click.stop
          :src="props.src"
          :alt="props.alt"
          :title="props.title"
          class="ink-image__img-expanded"
          data-testid="ink-image-img-expanded"
          @error="handleImageError"
        />

        <!-- Footer -->
        <div
          v-if="props.title || $slots['expanded-footer']"
          class="ink-image__expanded-footer"
        >
          <slot name="expanded-footer">
            <div class="ink-image__expanded-title">
              {{ props.title }}
            </div>
          </slot>
        </div>
      </div>
    </InkScrim>
  </div>
</template>

<style lang="scss" scoped src="./inkImage.scss"></style>
