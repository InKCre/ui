<script setup lang="ts">
import { computed } from "vue";
import { inkPaginationProps, inkPaginationEmits } from "./inkPagination";
import InkButton from "../inkButton/inkButton.vue";

const props = defineProps(inkPaginationProps);
const emit = defineEmits(inkPaginationEmits);

const totalPages = computed(() =>
  Number.isFinite(props.totalPages) ? Math.max(0, Math.trunc(props.totalPages)) : 0,
);
const currentPage = computed(() =>
  totalPages.value === 0
    ? 0
    : Math.min(
        totalPages.value,
        Math.max(1, Number.isFinite(props.currentPage) ? Math.trunc(props.currentPage) : 1),
      ),
);
const isPrevDisabled = computed(() => currentPage.value <= 1);
const isNextDisabled = computed(() => currentPage.value >= totalPages.value);

const visiblePages = computed(() => {
  if (props.type !== "default") {
    return [];
  }

  const pages: (number | string)[] = [];
  const total = totalPages.value;
  const current = currentPage.value;

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
  if (typeof page === "number" && page !== currentPage.value) {
    emit("page-change", page);
  }
};

const handlePrev = () => {
  if (!isPrevDisabled.value) {
    emit("page-change", currentPage.value - 1);
  }
};

const handleNext = () => {
  if (!isNextDisabled.value) {
    emit("page-change", currentPage.value + 1);
  }
};

const getPageButtonClass = (page: number | string) => {
  const isActive = typeof page === "number" && page === currentPage.value;
  return [
    "ink-pagination__page",
    { "ink-pagination__page--active": isActive },
    { "ink-pagination__page--ellipsis": page === "..." },
  ];
};
</script>

<template>
  <nav
    aria-label="Pagination"
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
        aria-label="Previous page"
        @click="handlePrev"
      />

      <button
        type="button"
        :aria-current="page === currentPage ? 'page' : undefined"
        :aria-label="typeof page === 'number' ? `Page ${page}` : undefined"
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
        aria-label="Next page"
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
      <div class="ink-pagination__page-info">{{ currentPage }} of {{ totalPages }}</div>
      <InkButton
        text="Next"
        class="ink-pagination__text-nav"
        theme="subtle"
        size="sm"
        :disabled="isNextDisabled"
        @click="handleNext"
      />
    </template>
  </nav>
</template>

<style lang="scss" scoped src="./inkPagination.scss"></style>
