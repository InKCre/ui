<script setup lang="ts">
import { ref } from "vue";
import InkTextarea from "../../src/components/inkTextarea/inkTextarea.vue";

const textValue = ref("");
</script>

<template>
  <Story title="Forms/Textarea">
    <Variant title="Default">
      <InkTextarea
        v-model:value="textValue"
        label="Description"
        placeholder="Enter description..."
        layout="col"
      />
    </Variant>

    <Variant title="Optional">
      <InkTextarea
        v-model:value="textValue"
        label="Notes"
        placeholder="Optional notes"
        :required="false"
        layout="col"
      />
    </Variant>

    <Variant title="Required">
      <InkTextarea
        v-model:value="textValue"
        label="Comments"
        placeholder="Required field"
        :required="true"
        layout="col"
      />
    </Variant>

    <Variant title="Customize Rows">
      <InkTextarea v-model:value="textValue" label="Short Text" :rows="6" layout="col" />
    </Variant>
  </Story>
</template>
