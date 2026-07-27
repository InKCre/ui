<script setup lang="ts">
import { ref } from "vue";
import InkAutoForm from "../../src/components/inkAutoForm/inkAutoForm.vue";
import type { JSONSchema } from "../../src/components/inkAutoForm/inkAutoForm";

// Schema for basic text fields
const basicTextSchema: JSONSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      title: "Full Name",
      description: "Enter your full name",
    },
    email: {
      type: "string",
      title: "Email Address",
      description: "Enter your email",
      pattern: "^[^@]+@[^@]+\\.[^@]+$",
    },
    age: {
      type: "integer",
      title: "Age",
      minimum: 0,
      maximum: 150,
    },
  },
  required: ["name", "email"],
};

const basicFormData = ref({
  name: "",
  email: "",
  age: undefined,
});

// Schema with textarea
const textareaSchema: JSONSchema = {
  type: "object",
  properties: {
    bio: {
      type: "string",
      title: "Biography",
      description: "Tell us about yourself",
      maxLength: 500,
    },
  },
};

const textareaFormData = ref({
  bio: "",
});

// Schema with boolean switch
const switchSchema: JSONSchema = {
  type: "object",
  properties: {
    notifications: {
      type: "boolean",
      title: "Enable Notifications",
      default: true,
    },
    newsletter: {
      type: "boolean",
      title: "Subscribe to Newsletter",
      default: false,
    },
  },
};

const switchFormData = ref({
  notifications: true,
  newsletter: false,
});

// Schema with dropdown (enum)
const dropdownSchema: JSONSchema = {
  type: "object",
  properties: {
    country: {
      type: "string",
      title: "Country",
      enum: ["USA", "Canada", "UK", "Australia", "Germany"],
    },
    role: {
      type: "string",
      title: "Role",
      enum: ["Admin", "User", "Guest"],
      default: "User",
    },
  },
  required: ["country"],
};

const dropdownFormData = ref({
  country: "",
  role: "User",
});

// Schema with date/time pickers
const dateTimeSchema: JSONSchema = {
  type: "object",
  properties: {
    birthDate: {
      type: "string",
      format: "date",
      title: "Birth Date",
    },
    appointmentTime: {
      type: "string",
      format: "time",
      title: "Appointment Time",
    },
    eventDateTime: {
      type: "string",
      format: "date-time",
      title: "Event Date & Time",
    },
  },
};

const dateTimeFormData = ref({
  birthDate: "",
  appointmentTime: "",
  eventDateTime: "",
});

// Schema with default values
const defaultValuesSchema: JSONSchema = {
  type: "object",
  properties: {
    username: {
      type: "string",
      title: "Username",
      default: "guest",
    },
    theme: {
      type: "string",
      title: "Theme",
      enum: ["light", "dark", "auto"],
      default: "auto",
    },
    autoSave: {
      type: "boolean",
      title: "Auto Save",
      default: true,
    },
  },
};

const defaultValuesFormData = ref({});

// Schema with validation errors
const validationSchema: JSONSchema = {
  type: "object",
  properties: {
    username: {
      type: "string",
      title: "Username",
      minLength: 3,
      maxLength: 20,
    },
    password: {
      type: "string",
      title: "Password",
      minLength: 8,
    },
    age: {
      type: "integer",
      title: "Age",
      minimum: 18,
      maximum: 100,
    },
  },
  required: ["username", "password"],
};

const validationFormData = ref({
  username: "ab", // Too short
  password: "123", // Too short
  age: 15, // Below minimum
});

// Invalid schema (non-object)
const invalidSchema: any = {
  type: "string",
};

const invalidFormData = ref({});

// Complex form with mixed fields
const complexSchema: JSONSchema = {
  type: "object",
  properties: {
    firstName: {
      type: "string",
      title: "First Name",
    },
    lastName: {
      type: "string",
      title: "Last Name",
    },
    isStudent: {
      type: "boolean",
      title: "Are you a student?",
      default: false,
    },
    level: {
      type: "string",
      title: "Education Level",
      enum: ["High School", "Bachelor", "Master", "PhD"],
    },
    graduationDate: {
      type: "string",
      format: "date",
      title: "Graduation Date",
    },
    comments: {
      type: "string",
      title: "Additional Comments",
      maxLength: 200,
    },
  },
  required: ["firstName", "lastName", "level"],
};

const complexFormData = ref({});
</script>

<template>
  <Story title="Forms/AutoForm" :layout="{ type: 'single', iframe: false }">
    <!-- [Canonical] Basic Text Fields -->
    <Variant title="Text Fields with Validation">
      <InkAutoForm :schema="basicTextSchema" v-model:form-data="basicFormData" layout="col" />
      <pre class="story-debug">{{ basicFormData }}</pre>
    </Variant>

    <!-- [Canonical] Textarea -->
    <Variant title="Textarea (Long Text)">
      <InkAutoForm :schema="textareaSchema" v-model:form-data="textareaFormData" layout="col" />
      <pre class="story-debug">{{ textareaFormData }}</pre>
    </Variant>

    <!-- [Canonical] Boolean Switches -->
    <Variant title="Boolean Switches">
      <InkAutoForm :schema="switchSchema" v-model:form-data="switchFormData" layout="col" />
      <pre class="story-debug">{{ switchFormData }}</pre>
    </Variant>

    <!-- [Canonical] Dropdowns (Enum) -->
    <Variant title="Dropdown (Enum Values)">
      <InkAutoForm :schema="dropdownSchema" v-model:form-data="dropdownFormData" layout="col" />
      <pre class="story-debug">{{ dropdownFormData }}</pre>
    </Variant>

    <!-- [Canonical] Date/Time Pickers -->
    <Variant title="Date and Time Pickers">
      <InkAutoForm :schema="dateTimeSchema" v-model:form-data="dateTimeFormData" layout="col" />
      <pre class="story-debug">{{ dateTimeFormData }}</pre>
    </Variant>

    <!-- [State] Default Values -->
    <Variant title="Default Values from Schema">
      <InkAutoForm
        :schema="defaultValuesSchema"
        v-model:form-data="defaultValuesFormData"
        layout="col"
      />
      <pre class="story-debug">{{ defaultValuesFormData }}</pre>
    </Variant>

    <!-- [State] Validation Errors -->
    <Variant title="Validation Errors">
      <InkAutoForm :schema="validationSchema" v-model:form-data="validationFormData" layout="col" />
      <pre class="story-debug">{{ validationFormData }}</pre>
    </Variant>

    <!-- [Invalid] Invalid Schema -->
    <Variant title="Invalid Schema Handling">
      <InkAutoForm :schema="invalidSchema" v-model:form-data="invalidFormData" layout="col" />
    </Variant>

    <!-- [Edge] Complex Mixed Form -->
    <Variant title="Complex Form (Mixed Field Types)">
      <InkAutoForm :schema="complexSchema" v-model:form-data="complexFormData" layout="col" />
      <pre class="story-debug">{{ complexFormData }}</pre>
    </Variant>

    <!-- [Edge] Inline Layout -->
    <Variant title="Inline Layout">
      <InkAutoForm :schema="basicTextSchema" :form-data="{}" layout="inline" />
    </Variant>

    <!-- [Edge] Row Layout -->
    <Variant title="Row Layout">
      <InkAutoForm :schema="basicTextSchema" :form-data="{}" layout="row" />
    </Variant>
  </Story>
</template>

<style scoped>
.story-debug {
  margin-top: 1rem;
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 0.875rem;
  max-height: 200px;
  overflow: auto;
}
</style>
