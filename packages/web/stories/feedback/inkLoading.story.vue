<script setup lang="ts">
import InkLoading from "../../src/components/inkLoading/inkLoading.vue";
</script>

<template>
  <Story title="Feedback/Loading" :layout="{ type: 'single', iframe: false }">
    <Variant title="Content waiting">
      <div style="padding: 2rem; min-height: 8rem; display: grid; place-items: center">
        <InkLoading label="正在读取预览" />
      </div>
    </Variant>
    <Variant title="Inline spinner">
      <div style="display: grid; gap: 1rem; padding: 1rem">
        <InkLoading variant="spinner" size="sm" density="sm" label="正在读取类型" />
        <InkLoading variant="spinner" size="xs" aria-label="正在追加日志" />
      </div>
    </Variant>
    <Variant title="Sizes and density">
      <div style="display: grid; gap: 1rem; padding: 1rem">
        <InkLoading size="xs" density="sm" label="正在读取节点" />
        <InkLoading size="sm" density="sm" label="正在读取内容" />
        <InkLoading size="md" density="md" label="正在读取图谱" />
      </div>
    </Variant>
  </Story>
</template>
