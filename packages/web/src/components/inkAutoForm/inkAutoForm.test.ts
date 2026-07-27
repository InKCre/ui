import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import InkAutoForm from "./inkAutoForm.vue";
import { mapSchemaPropertyToComponent, type JSONSchemaProperty } from "./inkAutoForm";

describe("inkAutoForm", () => {
  describe("Component Rendering", () => {
    it("renders form with valid schema", () => {
      const schema = {
        type: "object" as const,
        properties: {
          name: {
            type: "string" as const,
            title: "Name",
          },
        },
      };

      const wrapper = mount(InkAutoForm, {
        props: {
          schema,
          formData: {},
        },
      });

      expect(wrapper.find(".ink-auto-form__error").exists()).toBe(false);
    });

    it("shows error for invalid schema", () => {
      const invalidSchema: any = {
        type: "string",
      };

      const wrapper = mount(InkAutoForm, {
        props: {
          schema: invalidSchema,
          formData: {},
        },
      });

      expect(wrapper.find(".ink-auto-form__error").exists()).toBe(true);
      expect(wrapper.find(".ink-auto-form__error").text()).toContain("Invalid schema");
    });
  });

  describe("Schema-to-Component Mapping", () => {
    it("maps string type to inkInput", () => {
      const property: JSONSchemaProperty = {
        type: "string",
      };

      const result = mapSchemaPropertyToComponent(property);

      expect(result.component).toBe("inkInput");
    });

    it("maps string with long maxLength to inkTextarea", () => {
      const property: JSONSchemaProperty = {
        type: "string",
        maxLength: 200,
      };

      const result = mapSchemaPropertyToComponent(property);

      expect(result.component).toBe("inkTextarea");
    });

    it("maps boolean type to inkSwitch", () => {
      const property: JSONSchemaProperty = {
        type: "boolean",
      };

      const result = mapSchemaPropertyToComponent(property);

      expect(result.component).toBe("inkSwitch");
    });

    it("maps string with enum to inkDropdown", () => {
      const property: JSONSchemaProperty = {
        type: "string",
        enum: ["option1", "option2", "option3"],
      };

      const result = mapSchemaPropertyToComponent(property);

      expect(result.component).toBe("inkDropdown");
      expect(result.props.options).toHaveLength(3);
      expect(result.props.options[0]).toEqual({ label: "option1", value: "option1" });
    });

    it("maps string with date format to inkPicker", () => {
      const property: JSONSchemaProperty = {
        type: "string",
        format: "date",
      };

      const result = mapSchemaPropertyToComponent(property);

      expect(result.component).toBe("inkPicker");
      expect(result.props.type).toBe("date");
    });

    it("maps string with time format to inkPicker", () => {
      const property: JSONSchemaProperty = {
        type: "string",
        format: "time",
      };

      const result = mapSchemaPropertyToComponent(property);

      expect(result.component).toBe("inkPicker");
      expect(result.props.type).toBe("time");
    });

    it("maps string with date-time format to inkPicker", () => {
      const property: JSONSchemaProperty = {
        type: "string",
        format: "date-time",
      };

      const result = mapSchemaPropertyToComponent(property);

      expect(result.component).toBe("inkPicker");
      expect(result.props.type).toBe("datetime");
    });

    it("maps number type to inkInput", () => {
      const property: JSONSchemaProperty = {
        type: "number",
      };

      const result = mapSchemaPropertyToComponent(property);

      expect(result.component).toBe("inkInput");
    });

    it("maps integer type to inkInput", () => {
      const property: JSONSchemaProperty = {
        type: "integer",
      };

      const result = mapSchemaPropertyToComponent(property);

      expect(result.component).toBe("inkInput");
    });
  });

  describe("Form Data Updates", () => {
    it("emits update:formData when field value changes", async () => {
      const schema = {
        type: "object" as const,
        properties: {
          name: {
            type: "string" as const,
            title: "Name",
          },
        },
      };

      const wrapper = mount(InkAutoForm, {
        props: {
          schema,
          formData: {},
        },
      });

      // Find the input component and trigger update
      const input = wrapper.findComponent({ name: "InkInput" });
      await input.vm.$emit("update:modelValue", "John Doe");

      expect(wrapper.emitted("update:formData")).toBeTruthy();
      const emitted = wrapper.emitted("update:formData") as any[];
      expect(emitted[emitted.length - 1][0]).toEqual({ name: "John Doe" });
    });
  });

  describe("Default Values", () => {
    it("initializes form data with default values from schema", async () => {
      const schema = {
        type: "object" as const,
        properties: {
          username: {
            type: "string" as const,
            title: "Username",
            default: "guest",
          },
          notifications: {
            type: "boolean" as const,
            title: "Notifications",
            default: true,
          },
        },
      };

      const wrapper = mount(InkAutoForm, {
        props: {
          schema,
          formData: {},
        },
      });

      await wrapper.vm.$nextTick();

      const emitted = wrapper.emitted("update:formData") as any[];
      expect(emitted).toBeTruthy();
      expect(emitted[0][0]).toEqual({
        username: "guest",
        notifications: true,
      });
    });
  });
});
