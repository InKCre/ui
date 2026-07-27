<script setup lang="ts">
import InkButton from "../../src/components/inkButton/inkButton.vue";
</script>

<template>
  <Story title="Controls/Button" :layout="{ type: 'grid', width: '100%' }">
    <!-- [Semantic] Variants -->
    <Variant title="Subtle">
      <InkButton text="Subtle Button" theme="subtle" />
    </Variant>

    <Variant title="Primary">
      <InkButton text="Primary Button" theme="primary" />
    </Variant>

    <Variant title="Danger">
      <InkButton text="Danger Button" theme="danger" />
    </Variant>

    <!-- [Semantic] Sizes -->
    <Variant title="Medium (Default)">
      <InkButton text="Medium Button" theme="primary" size="md" />
    </Variant>

    <Variant title="Small">
      <InkButton text="Small Button" theme="primary" size="sm" />
    </Variant>

    <!-- [State] Loading -->
    <Variant title="Loading State - Subtle">
      <InkButton text="Loading Button" theme="subtle" :isLoading="true" />
    </Variant>

    <Variant title="Loading State - Primary">
      <InkButton text="Loading Button" theme="primary" :isLoading="true" />
    </Variant>

    <Variant title="Loading State - Danger">
      <InkButton text="Loading Button" theme="danger" :isLoading="true" />
    </Variant>

    <!-- [Edge] Content Stress -->
    <Variant title="Very Long Text">
      <InkButton
        text="This is an extremely long button text that should not break the layout completely"
        theme="primary"
      />
    </Variant>

    <Variant title="Short Text">
      <InkButton text="OK" theme="primary" />
    </Variant>

    <!-- [Visual] Icons -->
    <Variant title="Icon Prefix">
      <InkButton text="Settings" icon="i-mdi-cog" theme="primary" />
    </Variant>

    <Variant title="Icon Suffix">
      <InkButton text="Next" icon="i-mdi-arrow-right" icon-placement="suffix" theme="primary" />
    </Variant>

    <Variant title="Icon Only (Square)">
      <InkButton icon="i-mdi-plus" type="square" theme="primary" />
    </Variant>
  </Story>
</template>
