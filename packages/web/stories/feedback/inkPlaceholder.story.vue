<script setup lang="ts">
import { useI18n } from "vue-i18n";
import InkPlaceholder from "../../src/components/inkPlaceholder/inkPlaceholder.vue";
import InkButton from "../../src/components/inkButton/inkButton.vue";

const { locale, availableLocales } = useI18n();

function initState() {
  return {
    locale: locale.value,
  };
}
</script>

<template>
  <Story
    title="Feedback/Placeholder"
    :layout="{ type: 'grid', width: '100%' }"
    :init-state="initState"
  >
    <template #controls="{ state }">
      <HstSelect
        v-model="state.locale"
        title="Language"
        :options="availableLocales"
        @update:model-value="locale = state.locale"
      />
    </template>

    <!-- [Semantic] Empty State -->
    <Variant title="Empty State - Default">
      <InkPlaceholder state="empty" />
    </Variant>

    <Variant title="Empty State - Custom Text">
      <InkPlaceholder
        state="empty"
        title="No items found"
        description="Try adding your first item to get started."
      />
    </Variant>

    <Variant title="Empty State - Custom Illustration">
      <InkPlaceholder
        state="empty"
        illustration="i-mdi-folder-outline"
        title="No files"
        description="Upload a file to see it here."
      />
    </Variant>

    <!-- [Semantic] Error State -->
    <Variant title="Error State - Default">
      <InkPlaceholder state="error" />
    </Variant>

    <Variant title="Error State - Custom Text">
      <InkPlaceholder
        state="error"
        title="Failed to load data"
        description="We couldn't retrieve your data. Please check your connection and try again."
      />
    </Variant>

    <!-- [Feature] With Actions -->
    <Variant title="Empty State - With Actions">
      <InkPlaceholder
        state="empty"
        title="No projects"
        description="Start by creating your first project."
      >
        <template #actions>
          <InkButton text="Create Project" theme="primary" />
          <InkButton text="Import Project" theme="subtle" />
        </template>
      </InkPlaceholder>
    </Variant>

    <Variant title="Error State - With Retry Action">
      <InkPlaceholder
        state="error"
        title="Connection failed"
        description="Unable to connect to the server."
      >
        <template #actions>
          <InkButton text="Retry" theme="primary" />
        </template>
      </InkPlaceholder>
    </Variant>

    <!-- [Feature] Custom Slots -->
    <Variant title="Custom Illustration Slot">
      <InkPlaceholder
        state="empty"
        title="Custom illustration"
        description="Using slot to override the default illustration"
      >
        <template #illustration>
          <div style="font-size: 64px">🎨</div>
        </template>
      </InkPlaceholder>
    </Variant>

    <Variant title="Custom Title Slot">
      <InkPlaceholder state="empty">
        <template #title>
          <h2 style="color: #4a90e2; font-weight: bold">Custom Styled Title</h2>
        </template>
      </InkPlaceholder>
    </Variant>

    <Variant title="Fully Custom Content">
      <InkPlaceholder state="empty">
        <template #illustration>
          <span class="i-mdi-rocket-launch" style="font-size: 64px; color: #f39c12" />
        </template>
        <template #title>
          <h2 style="color: #2c3e50">Welcome aboard!</h2>
        </template>
        <template #description>
          <p style="color: #7f8c8d">Let's get started with something amazing.</p>
        </template>
        <template #actions>
          <InkButton text="Get Started" theme="primary" />
          <InkButton text="Learn More" theme="subtle" />
        </template>
      </InkPlaceholder>
    </Variant>

    <!-- [Edge] Long Content -->
    <Variant title="Long Description">
      <InkPlaceholder
        state="empty"
        title="Very detailed empty state"
        description="This is an extremely long description that should wrap properly and maintain good readability even when it contains a lot of text explaining the situation in great detail to the user who might need all this information to understand what's going on."
      />
    </Variant>
  </Story>
</template>
