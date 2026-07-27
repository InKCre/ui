<script setup lang="ts">
import InkLoading from "../../src/components/inkLoading/inkLoading.vue";
</script>

<template>
  <Story title="Feedback/Loading" :layout="{ type: 'single', iframe: false }">
    <Variant title="Basic">
      <div style="padding: 40px; display: flex; justify-content: center">
        <InkLoading />
      </div>
    </Variant>
  </Story>
</template>
