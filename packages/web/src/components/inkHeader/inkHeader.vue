<script setup lang="ts">
import { computed, inject } from "vue";
import { inkHeaderProps, inkHeaderEmits } from "./inkHeader";
import { useOptionalRouter } from "../../router";

const props = defineProps(inkHeaderProps);
const emit = defineEmits(inkHeaderEmits);

const router = useOptionalRouter();

// --- computed ---
const displayPageTitle = computed(
  () => props.pageTitle ?? router?.currentName.value
);

// --- methods ---
const onMenuClick = () => {
  emit("menu-click");
};

const onTitleClick = () => {
  emit("title-click");
};
</script>

<template>
  <header class="ink-header">
    <div class="ink-header__logo" @click="onTitleClick">
      <img
        v-if="logoSrc"
        class="ink-header__logo-icon"
        :src="logoSrc"
        alt="InKCre Logo"
      />
      <span class="ink-header__logo-text">{{ title }}</span>
    </div>
    <div class="ink-header__right">
      <span v-if="displayPageTitle" class="ink-header__page-title">{{
        displayPageTitle
      }}</span>
      <slot name="right-icon">
        <span
          class="i-mdi-menu ink-header__menu-icon"
          @click="onMenuClick"
        ></span>
      </slot>
    </div>
  </header>
</template>

<style lang="scss" scoped src="./inkHeader.scss"></style>
