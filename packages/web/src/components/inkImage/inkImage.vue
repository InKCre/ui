<script setup lang="ts">
import { computed, ref, useId, watch } from "vue";
import { inkImageProps, inkImageEmits, type InkImageErrorPayload } from "./inkImage";
import InkScrim from "../inkScrim/inkScrim.vue";
import InkButton from "../inkButton/inkButton.vue";
import InkLoading from "../inkLoading/inkLoading.vue";
import InkPlaceholder from "../inkPlaceholder/inkPlaceholder.vue";
import { useOptionalModel } from "../../composables/use-optional-model";
import { useOptionalI18n } from "../../i18n";
import en from "../../locales/en";
import { useImageView } from "./use-image-view";

const props = defineProps(inkImageProps);
const emit = defineEmits(inkImageEmits);
const i18n = useOptionalI18n();
const imageReady = ref(false);
const previewError = ref(false);
const viewport = ref<HTMLDivElement>();
const previewImage = ref<HTMLImageElement>();
const view = useImageView(viewport);
const helpId = useId();

const text = (key: keyof typeof en.image) => (i18n ? i18n.t(`image.${key}`) : en.image[key]);

const expanded = useOptionalModel({
  props,
  emit,
  modelName: "expanded",
  defaultValue: false,
});

const lazyLoadAttr = computed(() => {
  return props.lazy ? { loading: "lazy" as const } : {};
});

watch([expanded, () => props.src], () => {
  view.resetImage();
  imageReady.value = false;
  previewError.value = false;
});

function handlePreviewLoad(event: Event) {
  const image = previewImage.value;
  // Detached image requests may finish after a source change or close.
  if (!image || event.currentTarget !== image) return;
  view.setImage(image);
  imageReady.value = true;
}

function handlePreviewError(error: Event) {
  if (error.currentTarget !== previewImage.value) return;
  previewError.value = true;
  handleImageError(error);
}

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
    <button
      type="button"
      :aria-label="props.alt || props.title || 'Expand image'"
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
    </button>

    <InkScrim
      v-model:open="expanded"
      :close-on-scrim="true"
      :show-close-button="true"
      :aria-label="props.alt || props.title || 'Image preview'"
      @close="handleClose"
      v-slot="{ close }"
    >
      <div class="ink-image__expanded" data-testid="ink-image-expanded">
        <div class="ink-image__toolbar">
          <div class="ink-image__zoom-controls">
            <InkButton
              type="square"
              icon="i-mdi-minus"
              :aria-label="text('zoomOut')"
              :disabled="!view.canZoomOut"
              @click="view.zoomTo(view.scale / 1.25)"
            />
            <output class="ink-image__zoom-level" :aria-label="text('zoomLevel')" aria-live="off"
              >{{ Math.round(view.scale * 100) }}%</output
            >
            <InkButton
              type="square"
              icon="i-mdi-plus"
              :aria-label="text('zoomIn')"
              :disabled="!view.canZoomIn"
              @click="view.zoomTo(view.scale * 1.25)"
            />
          </div>
          <InkButton
            :theme="view.isFit ? 'primary' : 'subtle'"
            :aria-pressed="view.isFit"
            :disabled="!imageReady"
            @click="view.fit()"
            >{{ text("fit") }}</InkButton
          >
          <InkButton
            :theme="view.isOriginal ? 'primary' : 'subtle'"
            :aria-label="`${text('originalSize')} (100%)`"
            :aria-pressed="view.isOriginal"
            :disabled="!imageReady"
            @click="view.zoomTo(1)"
            >100%</InkButton
          >
          <p :id="helpId" class="ink-image__help">
            {{ text("gestures")
            }}<span class="ink-image__keyboard-help"> {{ text("keyboard") }}</span>
          </p>
        </div>
        <div
          v-if="$slots['expanded-header']"
          class="ink-image__expanded-header"
          tabindex="0"
          role="region"
          :aria-label="text('details')"
        >
          <slot name="expanded-header"> </slot>
        </div>
        <div
          ref="viewport"
          class="ink-image__viewport"
          :class="{
            'ink-image__viewport--zoomed': !view.isFit,
            'ink-image__viewport--dragging': view.dragging,
          }"
          tabindex="0"
          role="region"
          :aria-label="props.alt || text('preview')"
          :aria-describedby="helpId"
          :aria-busy="!imageReady && !previewError"
          @click="view.shouldCloseOnClick($event) && close()"
          @wheel="view.wheel"
          @pointerdown="view.pointerDown"
          @pointermove="view.pointerMove"
          @pointerup="view.pointerUp"
          @pointercancel="view.pointerUp"
          @lostpointercapture="view.pointerUp"
          @dblclick="view.doubleClick"
          @keydown="view.keydown"
        >
          <InkPlaceholder
            v-if="previewError"
            class="ink-image__status"
            state="error"
            :title="text('error')"
            :description="props.alt || props.title"
            role="alert"
          />
          <template v-else>
            <InkLoading
              v-if="!imageReady"
              class="ink-image__status"
              :label="text('loading')"
              role="status"
            />
            <img
              ref="previewImage"
              :key="props.src"
              :style="view.imageStyle"
              v-show="imageReady"
              :src="props.src"
              :alt="props.alt"
              :title="props.title"
              :draggable="false"
              class="ink-image__img-expanded"
              data-testid="ink-image-img-expanded"
              @load="handlePreviewLoad"
              @error="handlePreviewError"
            />
          </template>
        </div>
        <div
          v-if="props.title || $slots['expanded-footer']"
          class="ink-image__expanded-footer"
          tabindex="0"
          role="region"
          :aria-label="text('caption')"
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
