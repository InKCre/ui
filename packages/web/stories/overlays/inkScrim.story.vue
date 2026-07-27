<script setup lang="ts">
import { ref } from "vue";
import InkScrim from "../../src/components/inkScrim/inkScrim.vue";

const open = ref(true);
</script>

<template>
  <Story title="Overlays/Scrim" :layout="{ type: 'grid', width: '100%' }">
    <!-- [Basic] Default -->
    <Variant title="Open Scrim">
      <InkScrim v-model:open="open" />
      <div class="p-4">
        <p class="text-gray-600">Scrim overlay is visible covering the background</p>
      </div>
    </Variant>

    <!-- [State] Closed -->
    <Variant title="Closed Scrim">
      <InkScrim v-model:open="open" />
      <div class="p-4">
        <p class="text-gray-600">Scrim is not visible</p>
      </div>
    </Variant>

    <!-- [Interaction] Close on scrim click -->
    <Variant title="Dismissible (closeOnScrim: true)">
      <div class="flex flex-col gap-4 p-4">
        <p class="text-gray-600 text-sm">Click the scrim to close it</p>
        <div class="inline-flex">
          <label class="flex items-center gap-2">
            <input type="checkbox" checked disabled />
            <span class="text-sm">closeOnScrim: true (default)</span>
          </label>
        </div>
      </div>
      <InkScrim v-model:open="open" />
    </Variant>

    <!-- [Interaction] Non-dismissible -->
    <Variant title="Non-Dismissible (closeOnScrim: false)">
      <div class="flex flex-col gap-4 p-4">
        <p class="text-gray-600 text-sm">Scrim click is emitted but scrim stays open</p>
        <div class="inline-flex">
          <label class="flex items-center gap-2">
            <input type="checkbox" />
            <span class="text-sm">closeOnScrim: false</span>
          </label>
        </div>
      </div>
      <InkScrim v-model:open="open" :close-on-scrim="false" />
    </Variant>
  </Story>
</template>
