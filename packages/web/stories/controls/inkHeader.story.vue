<script setup lang="ts">
import { ref } from "vue";
import InkHeader from "../../src/components/inkHeader/inkHeader.vue";
import logoSrc from "../../src/logo.svg";

const menuClicks = ref(0);
</script>

<template>
  <Story title="Controls/Header" :layout="{ type: 'single', iframe: false }">
    <Variant title="Basic">
      <InkHeader title="InKCre" pageTitle="Dashboard" @menu-click="menuClicks++" />
      <output>菜单点击次数：{{ menuClicks }}</output>
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
