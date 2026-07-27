import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import InkButton from "./inkButton.vue";

describe("InkButton", () => {
  it("renders button with text", () => {
    const wrapper = mount(InkButton, {
      props: {
        text: "Click me",
        type: "primary",
        size: "md",
      },
    });

    expect(wrapper.text()).toContain("Click me");
  });

  it("applies correct CSS classes for theme, type and size", () => {
    const wrapper = mount(InkButton, {
      props: {
        text: "Test",
        theme: "danger",
        type: "square",
        size: "sm",
      },
    });

    const button = wrapper.find("button");
    expect(button.classes()).toContain("ink-button--theme-danger");
    expect(button.classes()).toContain("ink-button--type-square");
    expect(button.classes()).toContain("ink-button--size-sm");
  });

  it("emits click event when clicked", async () => {
    const wrapper = mount(InkButton, {
      props: {
        text: "Click me",
      },
    });

    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("click");
  });

  it("does not emit click event when loading", async () => {
    const wrapper = mount(InkButton, {
      props: {
        text: "Click me",
        isLoading: true,
      },
    });

    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted()).not.toHaveProperty("click");
    expect(wrapper.find("button").attributes()).toHaveProperty("disabled");
  });

  it("renders icon when provided", () => {
    const wrapper = mount(InkButton, {
      props: {
        text: "Settings",
        icon: "i-mdi-cog",
      },
    });

    expect(wrapper.find(".ink-button__icon").exists()).toBe(true);
    expect(wrapper.find(".ink-button__icon").classes()).toContain("i-mdi-cog");
  });

  it("uses default values when props not provided", () => {
    const wrapper = mount(InkButton);
    const button = wrapper.find("button");

    expect(button.classes()).toContain("ink-button--theme-subtle");
    expect(button.classes()).toContain("ink-button--size-md");
    expect(button.classes()).toContain("ink-button--type-default");
  });
});
