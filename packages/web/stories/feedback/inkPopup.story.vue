<script setup lang="ts">
import { ref } from "vue";
import InkPopup from "../../src/components/inkPopup/inkPopup.vue";
import InkButton from "../../src/components/inkButton/inkButton.vue";

const visible = ref(false);
</script>

<template>
  <Story title="Feedback/Popup/[Semantic] Basic" :layout="{ type: 'single', iframe: false }">
    <Variant title="Default Popup">
      <InkButton text="Open Popup" theme="primary" @click="visible = true" />
      <InkPopup v-model:visible="visible">
        <div style="padding: 20px">
          <h3>Popup Content</h3>
          <p>This is the popup content.</p>
          <InkButton text="Close" theme="subtle" @click="visible = false" />
        </div>
      </InkPopup>
    </Variant>
  </Story>
</template>
