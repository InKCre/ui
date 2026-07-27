<script setup lang="ts">
import InkHeader from "../../src/components/inkHeader/inkHeader.vue";
import logoSrc from "../../src/logo.svg";
</script>

<template>
  <Story title="Controls/Header" :layout="{ type: 'single', iframe: false }">
    <Variant title="Basic">
      <InkHeader title="InKCre" pageTitle="Dashboard" />
    </Variant>

    <Variant title="With Logo">
      <InkHeader title="InKCre" :logoSrc="logoSrc" pageTitle="Dashboard" />
    </Variant>

    <Variant title="Without Logo">
      <InkHeader title="InKCre" pageTitle="Dashboard" />
    </Variant>

    <Variant title="Auto Page Title">
      <InkHeader title="InKCre" />
    </Variant>
  </Story>
</template>
