<script setup lang="ts">
import { ref } from "vue";
import InkPopup from "../../src/components/inkPopup/inkPopup.vue";
import InkButton from "../../src/components/inkButton/inkButton.vue";

const visible = ref(false);
const modelessVisible = ref(false);
</script>

<template>
  <Story title="Feedback/Popup/[Semantic] Basic" :layout="{ type: 'single', iframe: false }">
    <Variant title="Default Popup">
      <InkButton text="Open Popup" theme="primary" @click="visible = true" />
      <InkPopup v-model:open="visible">
        <div style="padding: 20px">
          <h3>Popup Content</h3>
          <p>This is the popup content.</p>
          <InkButton text="Close" theme="subtle" @click="visible = false" />
        </div>
      </InkPopup>
    </Variant>
    <Variant title="Modeless Popup">
      <InkButton text="Open modeless popup" theme="primary" @click="modelessVisible = true" />
      <InkPopup v-model:open="modelessVisible" :scrim="false" position="right">
        <div style="padding: 20px">
          <h3>Modeless content</h3>
          <p>The page outside this popup remains visible and pointer-accessible.</p>
          <InkButton text="Close" theme="subtle" @click="modelessVisible = false" />
        </div>
      </InkPopup>
    </Variant>
  </Story>
</template>
