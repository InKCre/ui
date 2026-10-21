<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { inkImageProps, inkImageEmits, type InkImageErrorPayload } from "./inkImage";
import InkScrim from "../inkScrim/inkScrim.vue";
import InkButton from "../inkButton/inkButton.vue";
import InkLoading from "../inkLoading/inkLoading.vue";
import InkPlaceholder from "../inkPlaceholder/inkPlaceholder.vue";
import { useOptionalModel } from "../../composables/use-optional-model";
import { useOptionalI18n } from "../../i18n";
import en from "../../locales/en";

const props = defineProps(inkImageProps);
const emit = defineEmits(inkImageEmits);
const i18n = useOptionalI18n();
const originalSize = ref(false);
const imageReady = ref(false);
const previewError = ref(false);
const viewport = ref<HTMLDivElement>();

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
  originalSize.value = false;
  imageReady.value = false;
  previewError.value = false;
  viewport.value?.scrollTo(0, 0);
});

async function setOriginalSize(value: boolean) {
  originalSize.value = value;
  await nextTick();
  viewport.value?.scrollTo(0, 0);
}

function handlePreviewError(error: Event) {
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
          <InkButton
            :theme="originalSize ? 'subtle' : 'primary'"
            :aria-pressed="!originalSize"
            @click="setOriginalSize(false)"
            >{{ text("fit") }}</InkButton
          >
          <InkButton
            :theme="originalSize ? 'primary' : 'subtle'"
            :aria-label="`${text('originalSize')} (100%)`"
            :aria-pressed="originalSize"
            :disabled="!imageReady"
            @click="setOriginalSize(true)"
            >100%</InkButton
          >
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
          :class="{ 'ink-image__viewport--original': originalSize }"
          tabindex="0"
          role="region"
          :aria-label="props.alt || text('preview')"
          :aria-busy="!imageReady && !previewError"
          @click.self="close"
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
              @click.stop
              :src="props.src"
              :alt="props.alt"
              :title="props.title"
              :draggable="false"
              class="ink-image__img-expanded"
              data-testid="ink-image-img-expanded"
              @load="imageReady = true"
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
