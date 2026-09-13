<script setup lang="ts">
import { ref } from "vue";
const deletions = ref(0);
import InkDoubleCheck from "../../src/components/inkDoubleCheck/inkDoubleCheck.vue";
import InkButton from "../../src/components/inkButton/inkButton.vue";
</script>

<template>
  <Story
    title="Feedback/DoubleCheck/[Semantic] Confirmation"
    :layout="{ type: 'single', iframe: false }"
  >
    <Variant title="Delete Confirmation">
      <InkDoubleCheck
        @confirm="deletions++"
        title="Delete Item?"
        message="This action cannot be undone. Are you sure you want to delete this item?"
        confirm-text="Delete"
        cancel-text="Cancel"
      >
        <InkButton text="Delete Item" theme="danger" />
      </InkDoubleCheck>
      <p>确认次数：{{ deletions }}</p>
    </Variant>
  </Story>
</template>
