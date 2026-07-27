<script setup lang="ts">
import { ref } from "vue";
import InkField from "../../src/components/inkField/inkField.vue";
</script>

<template>
  <Story title="Forms/Field" :layout="{ type: 'single', iframe: false }">
    <!-- [Semantic] Layouts -->
    <Variant title="Column">
      <InkField label="Username" value="john.doe" layout="col" />
    </Variant>

    <Variant title="Inline">
      <InkField label="Email" value="john@example.com" layout="inline" />
    </Variant>

    <Variant title="Row">
      <InkField label="Status" value="Active" layout="row" />
    </Variant>

    <!-- [State] Required -->
    <Variant title="Optional">
      <InkField label="Nickname" value="Johnny" layout="col" :required="false" />
    </Variant>

    <Variant title="Required">
      <InkField label="Password" value="••••••••" layout="col" :required="true" />
    </Variant>

    <!-- [Edge] Content Length -->
    <Variant title="Very Long Label">
      <InkField
        label="This is an extremely long field label that should not break the layout"
        value="Short value"
        layout="col"
      />
    </Variant>

    <Variant title="Very Long Value">
      <InkField
        label="URL"
        value="https://example.com/very/long/path/to/resource/that/should/not/break/layout"
        layout="inline"
      />
    </Variant>

    <Variant title="Empty Value">
      <InkField label="Optional Field" value="" layout="col" />
    </Variant>
  </Story>
</template>
