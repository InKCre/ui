<script setup lang="ts">
import { ref } from "vue";
import InkInput from "../../src/components/inkInput/inkInput.vue";

const basicValue = ref("");
const requiredValue = ref("");
const inlineName = ref("原名称");
const savedName = ref("尚未保存");
const passwordValue = ref("");
const passwordWithToggleValue = ref("");
</script>

<template>
  <Story title="Forms/Input" :layout="{ type: 'single', iframe: false }">
    <!-- [Semantic] With Label -->
    <Variant title="Column Layout">
      <InkInput v-model="basicValue" label="Full Name" placeholder="Enter your name" layout="col" />
    </Variant>

    <Variant title="Inline Layout">
      <InkInput
        v-model="basicValue"
        label="Email"
        placeholder="email@example.com"
        layout="inline"
      />
    </Variant>

    <!-- [State] Required -->
    <Variant title="Optional">
      <InkInput
        v-model="basicValue"
        label="Nickname"
        placeholder="Optional field"
        :required="false"
        layout="col"
      />
    </Variant>

    <Variant title="Required">
      <InkInput
        v-model="requiredValue"
        label="Email Address"
        placeholder="email@example.com"
        :required="true"
        layout="col"
      />
    </Variant>

    <!-- [Edge] Inline Edit Type -->
    <Variant title="Inline Editable">
      <InkInput modelValue="Click to edit this text" type="inline" placeholder="Enter text" />
    </Variant>
    <Variant title="Inline confirmation and cancellation">
      <InkInput v-model="inlineName" type="inline" label="名称" @confirm="savedName = $event" />
      <p>Enter 保存，Escape 或失焦取消。持久化入口收到：{{ savedName }}</p>
    </Variant>

    <!-- [Feature] Password Input -->
    <Variant title="Password (Default)">
      <InkInput
        v-model="passwordValue"
        label="Password"
        native-type="password"
        placeholder="Enter your password"
        layout="col"
      />
    </Variant>

    <Variant title="Password with Toggle">
      <InkInput
        v-model="passwordWithToggleValue"
        label="Password"
        native-type="password"
        :show-password-toggle="true"
        placeholder="Enter your password"
        layout="col"
      />
      <p style="margin-top: 8px; font-size: 0.875rem; color: #666">
        Click the eye icon to toggle password visibility
      </p>
    </Variant>
  </Story>
</template>
