<script setup lang="ts">
import { ref } from "vue";
import InkImage from "../../src/components/inkImage/inkImage.vue";
import imageFixture from "../../src/logo.svg";

const imageSrc = ref(imageFixture);
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
