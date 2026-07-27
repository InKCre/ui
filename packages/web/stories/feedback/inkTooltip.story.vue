<script setup lang="ts">
import InkTooltip from "../../src/components/inkTooltip/inkTooltip.vue";
</script>

<template>
  <Story title="Feedback/Tooltip" :layout="{ type: 'grid', width: '200px' }">
    <!-- [Semantic] Positions -->
    <Variant title="Top">
      <InkTooltip content="Tooltip on top" position="top">
        <button style="padding: 8px 16px; cursor: pointer">Hover (Top)</button>
      </InkTooltip>
    </Variant>

    <Variant title="Bottom">
      <InkTooltip content="Tooltip on bottom" position="bottom">
        <button style="padding: 8px 16px; cursor: pointer">Hover (Bottom)</button>
      </InkTooltip>
    </Variant>

    <Variant title="Left">
      <InkTooltip content="Tooltip on left" position="left">
        <button style="padding: 8px 16px; cursor: pointer">Hover (Left)</button>
      </InkTooltip>
    </Variant>

    <Variant title="Right">
      <InkTooltip content="Tooltip on right" position="right">
        <button style="padding: 8px 16px; cursor: pointer">Hover (Right)</button>
      </InkTooltip>
    </Variant>

    <!-- [Edge] Content Length -->
    <Variant title="Long Text">
      <InkTooltip
        content="This is a very long tooltip text that should wrap appropriately and not break the layout"
        position="top"
      >
        <button style="padding: 8px 16px; cursor: pointer">Hover for long text</button>
      </InkTooltip>
    </Variant>
  </Story>
</template>
