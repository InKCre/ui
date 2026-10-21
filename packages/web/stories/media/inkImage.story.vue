<script setup lang="ts">
import { ref } from "vue";
import InkImage from "../../src/components/inkImage/inkImage.vue";
import InkButton from "../../src/components/inkButton/inkButton.vue";
import imageFixture from "../../src/logo.svg";
import detailFixture from "./assets/image-detail.svg";
import tallFixture from "./assets/image-tall.svg";

const imageSrc = ref(imageFixture);
const controlledOpen = ref(false);
const controlledSource = ref(detailFixture);
const longCaption =
  "长图保留完整的上下文。放大后应能逐段阅读图片里的细节，说明文字也应当可达，但不能挤掉图片或遮住关闭操作。".repeat(
    8,
  );
</script>

<template>
  <Story title="Media/Image" :layout="{ type: 'grid', width: '100%' }">
    <!-- [Basic] Default -->
    <Variant title="Basic Usage">
      <InkImage :src="imageSrc" alt="InKCre 标志" />
    </Variant>

    <!-- [Visual] With title -->
    <Variant title="With Title">
      <InkImage :src="imageSrc" alt="InKCre 标志" title="InKCre 标志" />
    </Variant>

    <!-- [Styling] Custom Size (Style + Class) -->
    <Variant title="Custom Size (Style + Class)">
      <InkImage :src="imageSrc" alt="InKCre 标志" class="h-48" style="width: 200px" />
    </Variant>

    <!-- [Slot] Custom Thumbnail -->
    <Variant title="Custom Thumbnail Slot">
      <InkImage :src="imageSrc" alt="InKCre 标志">
        <template #thumbnail>
          <span class="grid">
            <img :src="imageSrc" alt="" class="block w-full h-auto" />
            <span class="image-story-surface">查看原图</span>
          </span>
        </template>
      </InkImage>
    </Variant>

    <!-- [State] Lazy Loading Disabled -->
    <Variant title="Eager Loading (lazy: false)">
      <InkImage :src="imageSrc" alt="InKCre 标志" :lazy="false" />
    </Variant>

    <!-- [Slot] With Footer -->
    <Variant title="With Expanded Footer">
      <InkImage :src="imageSrc" alt="InKCre 标志" title="InKCre 标志">
        <template #expanded-footer>
          <a :href="imageSrc" download="inkcre.svg" class="image-story-surface">下载原图（SVG）</a>
        </template>
      </InkImage>
    </Variant>

    <!-- [State] With Header Slot -->
    <Variant title="With Custom Header">
      <InkImage :src="imageSrc" alt="InKCre 标志">
        <template #expanded-header>
          <span class="image-story-surface">InKCre 标志</span>
        </template>
      </InkImage>
    </Variant>

    <Variant title="Large Image Detail">
      <InkImage
        :src="detailFixture"
        alt="Large diagram with fine text"
        title="Inspect the bottom-right detail at original size."
        style="width: 320px"
      />
    </Variant>

    <Variant title="Tall Image With Long Caption">
      <InkImage
        :src="tallFixture"
        alt="Tall reading specimen"
        :title="longCaption"
        style="width: 140px"
      />
    </Variant>
    <Variant title="Controlled Preview And Source Change">
      <InkButton @click="controlledOpen = true">Open controlled preview</InkButton>
      <InkImage
        v-model:expanded="controlledOpen"
        :src="controlledSource"
        alt="Controlled image preview"
        style="width: 320px"
      >
        <template #expanded-header>
          <InkButton
            size="sm"
            @click="
              controlledSource = controlledSource === detailFixture ? tallFixture : detailFixture
            "
            >Switch image</InkButton
          >
        </template>
        <template #expanded-footer>
          <span
            >Changing the image restores the full composition without closing this preview.</span
          >
        </template>
      </InkImage>
      <output>Preview {{ controlledOpen ? "open" : "closed" }}</output>
    </Variant>

    <Variant title="Unavailable Image">
      <InkImage src="data:image/png;base64,AA==" alt="Unavailable sample image" />
    </Variant>
  </Story>
</template>

<style lang="scss" scoped>
@use "@inkcre/ui-web/styles/mixins" as *;
@use "@inkcre/ui-web/styles/functions" as *;

.image-story-surface {
  @include apply-font(label-lg);
  display: block;
  padding: sys-var(space, xs) sys-var(space, sm);
  background: sys-var(color, surface, base);
  color: sys-var(color, text, base);
  overflow-wrap: anywhere;
}
</style>
