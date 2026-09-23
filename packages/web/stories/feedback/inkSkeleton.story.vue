<script setup lang="ts">
import InkSkeleton from "../../src/components/inkSkeleton/inkSkeleton.vue";
</script>

<template>
  <Story title="Feedback/Skeleton" :layout="{ type: 'single', iframe: false }">
    <Variant title="Known list structure">
      <div role="status" aria-label="正在读取列表" style="display: grid; gap: 2rem; padding: 1rem">
        <div v-for="item in 3" :key="item" style="display: grid; gap: 0.5rem">
          <InkSkeleton style="width: 40%; height: 1.25rem" />
          <InkSkeleton style="width: 85%" />
        </div>
      </div>
    </Variant>
  </Story>
</template>
