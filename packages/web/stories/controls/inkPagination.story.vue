<script setup lang="ts">
import { ref } from "vue";
import InkPagination from "../../src/components/inkPagination/inkPagination.vue";

const currentPage1 = ref(1);
const currentPage2 = ref(5);
const currentPage3 = ref(1);
const currentPage4 = ref(15);
const currentPageText1 = ref(1);
const currentPageText2 = ref(3);
</script>

<template>
  <Story title="Controls/Pagination" :layout="{ type: 'grid', width: '100%' }">
    <!-- [Semantic] Basic Usage -->
    <Variant title="Few Pages (1-5)">
      <InkPagination
        :current-page="currentPage1"
        :total-pages="5"
        @page-change="(page) => (currentPage1 = page)"
      />
      <p>Current page: {{ currentPage1 }}</p>
    </Variant>

    <Variant title="Many Pages (1-20)">
      <InkPagination
        :current-page="currentPage2"
        :total-pages="20"
        @page-change="(page) => (currentPage2 = page)"
      />
      <p>Current page: {{ currentPage2 }}</p>
    </Variant>

    <!-- [State] Edge Cases -->
    <Variant title="First Page">
      <InkPagination
        :current-page="currentPage3"
        :total-pages="10"
        @page-change="(page) => (currentPage3 = page)"
      />
      <p>Current page: {{ currentPage3 }}</p>
    </Variant>

    <Variant title="Last Page">
      <InkPagination
        :current-page="currentPage4"
        :total-pages="15"
        @page-change="(page) => (currentPage4 = page)"
      />
      <p>Current page: {{ currentPage4 }}</p>
    </Variant>

    <!-- [Edge] Single Page -->
    <Variant title="Single Page Only">
      <InkPagination :current-page="1" :total-pages="1" />
    </Variant>

    <!-- [Type] Text Type -->
    <Variant title="Text Type - Few Pages">
      <InkPagination
        type="text"
        :current-page="currentPageText1"
        :total-pages="5"
        @page-change="(page) => (currentPageText1 = page)"
      />
      <p>Current page: {{ currentPageText1 }}</p>
    </Variant>

    <Variant title="Text Type - Many Pages">
      <InkPagination
        type="text"
        :current-page="currentPageText2"
        :total-pages="20"
        @page-change="(page) => (currentPageText2 = page)"
      />
      <p>Current page: {{ currentPageText2 }}</p>
    </Variant>
  </Story>
</template>
