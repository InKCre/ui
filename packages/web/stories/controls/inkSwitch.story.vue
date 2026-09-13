<script setup lang="ts">
import { ref } from "vue";
import InkSwitch from "../../src/components/inkSwitch/inkSwitch.vue";

const switchMd = ref(false);
</script>

<template>
  <Story title="Controls/Switch" :layout="{ type: 'grid', width: '200px' }">
    <!-- [Semantic] Sizes -->
    <Variant title="Extra Small">
      <InkSwitch v-model="switchMd" size="xs" aria-label="Enable" />
    </Variant>

    <Variant title="Small">
      <InkSwitch v-model="switchMd" size="sm" aria-label="Feature" />
    </Variant>

    <Variant title="Medium">
      <InkSwitch v-model="switchMd" size="md" aria-label="Setting" />
    </Variant>

    <Variant title="Large">
      <InkSwitch v-model="switchMd" size="lg" aria-label="Option" />
    </Variant>

    <!-- [State] Toggle States -->
    <Variant title="Off">
      <InkSwitch :modelValue="false" size="md" aria-label="Disabled" />
    </Variant>

    <Variant title="On">
      <InkSwitch :modelValue="true" size="md" aria-label="Enabled" />
    </Variant>
    <Variant title="长状态文案保持轨道尺寸">
      <InkSwitch
        v-model="switchMd"
        size="xs"
        on-text="Enabled"
        off-text="Disabled"
        aria-label="通知开关"
      />
      <InkSwitch
        v-model="switchMd"
        size="xs"
        on-text="已开启"
        off-text="已关闭"
        aria-label="同步开关"
      />
      <InkSwitch
        :model-value="switchMd"
        is-switching
        size="xs"
        on-text="Enabled"
        off-text="Disabled"
        aria-label="等待中的通知开关"
      />
    </Variant>
  </Story>
</template>
