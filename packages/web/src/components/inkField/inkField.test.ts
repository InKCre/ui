import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import InkField from "./inkField.vue";

describe("InkField", () => {
  it("renders label and value", () => {
    const wrapper = mount(InkField, {
      props: {
        label: "Username",
        value: "john.doe",
        layout: "col",
      },
    });

    expect(wrapper.text()).toContain("Username");
    expect(wrapper.text()).toContain("john.doe");
  });

  it("applies correct layout class", () => {
    const wrapper = mount(InkField, {
      props: {
        label: "Test",
        layout: "inline",
      },
    });

    expect(wrapper.classes()).toContain("ink-field--inline");
  });

  it("shows required indicator when required is true", () => {
    const wrapper = mount(InkField, {
      props: {
        label: "Password",
        required: true,
      },
    });

    expect(wrapper.find(".ink-field__required").exists()).toBe(true);
  });

  it("emits value-click when editable value is clicked", async () => {
    const wrapper = mount(InkField, {
      props: {
        label: "Bio",
        value: "Click me",
        editable: true,
      },
    });

    await wrapper.find(".ink-field__value").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("value-click");
  });

  it("renders slot content when provided", () => {
    const wrapper = mount(InkField, {
      props: {
        label: "Custom",
      },
      slots: {
        default: "<input type='text' value='Custom Input' />",
      },
    });

    expect(wrapper.html()).toContain("Custom Input");
  });
});
