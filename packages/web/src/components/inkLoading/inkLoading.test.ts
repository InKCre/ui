import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import InkLoading from "./inkLoading.vue";

describe("InkLoading", () => {
  it("renders loading spinner", () => {
    const wrapper = mount(InkLoading);
    expect(wrapper.find(".ink-loading").exists()).toBe(true);
  });

  it("has the correct structure with blocks", () => {
    const wrapper = mount(InkLoading);
    const blocks = wrapper.findAll(".ink-loading__block");
    expect(blocks).toHaveLength(3);
  });
});
