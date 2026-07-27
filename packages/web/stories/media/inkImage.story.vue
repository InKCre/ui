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
      <InkImage :src="imageSrc" alt="Mountain landscape" />
    </Variant>

    <!-- [Visual] With title -->
    <Variant title="With Title">
      <InkImage :src="imageSrc" alt="Ocean sunset" title="Beautiful Ocean Sunset" />
    </Variant>

    <!-- [Styling] Custom Size (Style + Class) -->
    <Variant title="Custom Size (Style + Class)">
      <InkImage :src="imageSrc" alt="Mountain landscape" class="h-48" style="width: 200px" />
    </Variant>

    <!-- [Slot] Custom Thumbnail -->
    <Variant title="Custom Thumbnail Slot">
      <InkImage :src="imageSrc" alt="Mountain landscape">
        <template #thumbnail>
          <div class="relative overflow-hidden rounded-lg group">
            <img :src="imageSrc" alt="Mountain landscape" class="w-full h-auto" />
            <div
              class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center"
            >
              <span
                class="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                >View Full</span
              >
            </div>
          </div>
        </template>
      </InkImage>
    </Variant>

    <!-- [State] Lazy Loading Disabled -->
    <Variant title="Eager Loading (lazy: false)">
      <InkImage :src="imageSrc" alt="City skyline" :lazy="false" />
    </Variant>

    <!-- [Slot] With Footer -->
    <Variant title="With Expanded Footer">
      <InkImage :src="imageSrc" alt="Mountain landscape" title="Mountain Adventure">
        <template #expanded-footer>
          <div class="flex gap-2">
            <button class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">
              Download
            </button>
            <button class="px-3 py-1 bg-gray-300 text-gray-800 text-xs rounded hover:bg-gray-400">
              Share
            </button>
          </div>
        </template>
      </InkImage>
    </Variant>

    <!-- [State] With Header Slot -->
    <Variant title="With Custom Header">
      <InkImage :src="imageSrc" alt="Mountain landscape">
        <template #expanded-header>
          <span class="text-sm text-gray-600">📸 Photo Details</span>
        </template>
      </InkImage>
    </Variant>
  </Story>
</template>
