<script setup lang="ts">
import InkTooltip from "../../src/components/inkTooltip/inkTooltip.vue";
</script>

<template>
  <Story title="Feedback/Tooltip" :layout="{ type: 'grid', width: '200px' }">
    <!-- [Semantic] Positions -->
    <Variant title="Top">
      <InkTooltip v-slot="{ describedby }" content="Tooltip on top" position="top">
        <button
          type="button"
          :aria-describedby="describedby"
          style="padding: 8px 16px; cursor: pointer"
        >
          Hover (Top)
        </button>
      </InkTooltip>
    </Variant>

    <Variant title="Bottom">
      <InkTooltip v-slot="{ describedby }" content="Tooltip on bottom" position="bottom">
        <button
          type="button"
          :aria-describedby="describedby"
          style="padding: 8px 16px; cursor: pointer"
        >
          Hover (Bottom)
        </button>
      </InkTooltip>
    </Variant>

    <Variant title="Left">
      <InkTooltip v-slot="{ describedby }" content="Tooltip on left" position="left">
        <button
          type="button"
          :aria-describedby="describedby"
          style="padding: 8px 16px; cursor: pointer"
        >
          Hover (Left)
        </button>
      </InkTooltip>
    </Variant>

    <Variant title="Right">
      <InkTooltip v-slot="{ describedby }" content="Tooltip on right" position="right">
        <button
          type="button"
          :aria-describedby="describedby"
          style="padding: 8px 16px; cursor: pointer"
        >
          Hover (Right)
        </button>
      </InkTooltip>
    </Variant>

    <!-- [Edge] Content Length -->
    <Variant title="Long Text">
      <InkTooltip
        v-slot="{ describedby }"
        content="This is a very long tooltip text that should wrap appropriately and not break the layout"
        position="top"
      >
        <button
          type="button"
          :aria-describedby="describedby"
          style="padding: 8px 16px; cursor: pointer"
        >
          Hover for long text
        </button>
      </InkTooltip>
    </Variant>
  </Story>
</template>
