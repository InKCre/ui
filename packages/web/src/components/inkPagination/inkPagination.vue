<script setup lang="ts">
import { computed } from "vue";
import { inkPaginationProps, inkPaginationEmits } from "./inkPagination";
import InkButton from "../inkButton/inkButton.vue";

const props = defineProps(inkPaginationProps);
const emit = defineEmits(inkPaginationEmits);

const isPrevDisabled = computed(() => props.currentPage <= 1);
const isNextDisabled = computed(() => props.currentPage >= props.totalPages);

const visiblePages = computed(() => {
  if (props.type !== "default") {
    return [];
  }

  const pages: (number | string)[] = [];
  const total = props.totalPages;
  const current = props.currentPage;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    return pages;
  }

  pages.push(1);

  const showLeftEllipsis = current > 3;
  const showRightEllipsis = current < total - 2;

  if (showLeftEllipsis) {
    pages.push("...");
  }

  const startPage = Math.max(2, current - 1);
  const endPage = Math.min(total - 1, current + 1);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (showRightEllipsis) {
    pages.push("...");
  }

  pages.push(total);

  return pages;
});

const handlePageClick = (page: number | string) => {
  if (typeof page === "number" && page !== props.currentPage) {
    emit("page-change", page);
  }
};

const handlePrev = () => {
  if (!isPrevDisabled.value) {
    emit("page-change", props.currentPage - 1);
  }
};

const handleNext = () => {
  if (!isNextDisabled.value) {
    emit("page-change", props.currentPage + 1);
  }
};

const getPageButtonClass = (page: number | string) => {
  const isActive = typeof page === "number" && page === props.currentPage;
  return [
    "ink-pagination__page",
    { "ink-pagination__page--active": isActive },
    { "ink-pagination__page--ellipsis": page === "..." },
  ];
};
</script>

<template>
  <div
    class="ink-pagination"
    :class="{ 'ink-pagination--text': props.type === 'text' }"
  >
    <!-- Default type: icon buttons with numbered pages -->
    <template v-if="props.type === 'default'">
      <InkButton
        class="ink-pagination__nav ink-pagination__nav--prev"
        :disabled="isPrevDisabled"
        size="md"
        type="square"
        icon="i-mdi-chevron-left"
        @click="handlePrev"
      />

      <button
        v-for="(page, index) in visiblePages"
        :key="index"
        :class="getPageButtonClass(page)"
        :disabled="page === '...'"
        @click="handlePageClick(page)"
      >
        {{ page }}
      </button>

      <InkButton
        class="ink-pagination__nav ink-pagination__nav--next"
        :disabled="isNextDisabled"
        size="md"
        type="square"
        icon="i-mdi-chevron-right"
        @click="handleNext"
      />
    </template>

    <!-- Text type: text buttons with page info -->
    <template v-else>
      <InkButton
        text="Previous"
        class="ink-pagination__text-nav"
        theme="subtle"
        size="sm"
        :disabled="isPrevDisabled"
        @click="handlePrev"
      />
      <div class="ink-pagination__page-info">
        {{ props.currentPage }} of {{ props.totalPages }}
      </div>
      <InkButton
        text="Next"
        class="ink-pagination__text-nav"
        theme="subtle"
        size="sm"
        :disabled="isNextDisabled"
        @click="handleNext"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped src="./inkPagination.scss"></style>
