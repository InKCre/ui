<template>
  <div id="app">
    <h1>InKCre WebDesign Playground</h1>

    <section style="padding: 20px">
      <h2>Components</h2>

      <div style="margin: 20px 0">
        <h3>inkButton</h3>
        <InkButton text="Subtle Button" theme="subtle" @click="handleClick" />
        <InkButton text="Primary Button" theme="primary" @click="handleClick" />
        <InkButton text="Danger Button" theme="danger" @click="handleClick" />
      </div>

      <div style="margin: 20px 0">
        <h3>inkField</h3>
        <InkField label="Name" value="John Doe" layout="col" />
        <InkField
          label="Email"
          value="john@example.com"
          layout="inline"
          :editable="true"
        />
      </div>

      <div style="margin: 20px 0">
        <h3>inkInput</h3>
        <InkInput
          v-model="inputValue"
          label="Input Field"
          placeholder="Enter text..."
        />
        <p>Value: {{ inputValue }}</p>
      </div>

      <div style="margin: 20px 0">
        <h3>inkSwitch</h3>
        <InkSwitch v-model="switchValue" label="Enable Feature" />
        <p>Switch is: {{ switchValue ? "ON" : "OFF" }}</p>
      </div>

      <div style="margin: 20px 0">
        <h3>inkLoading</h3>
        <InkLoading />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import InkButton from "./components/inkButton/inkButton.vue";
import InkField from "./components/inkField/inkField.vue";
import InkInput from "./components/inkInput/inkInput.vue";
import InkSwitch from "./components/inkSwitch/inkSwitch.vue";
import InkLoading from "./components/inkLoading/inkLoading.vue";

const inputValue = ref("");
const switchValue = ref(false);

const handleClick = () => {
  alert("Button clicked!");
};
</script>

<style></style>
