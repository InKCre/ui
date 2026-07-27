import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import InkDropdown from "./inkDropdown.vue";
import InkButton from "../inkButton/inkButton.vue";
import type { DropdownOption } from "./inkDropdown";

describe("InkDropdown", () => {
  const staticOptions: DropdownOption[] = [
    { label: "Option 1", value: "opt1" },
    { label: "Option 2", value: "opt2" },
    { label: "Option 3", value: "opt3" },
  ];

  it("renders with static options", () => {
    const wrapper = mount(InkDropdown, {
      props: {
        options: staticOptions,
        modelValue: "",
      },
    });

    expect(wrapper.find(".ink-dropdown").exists()).toBe(true);
  });

  it("displays placeholder when no value is selected", () => {
    const wrapper = mount(InkDropdown, {
      props: {
        options: staticOptions,
        modelValue: "",
        placeholder: "Select an option",
      },
    });

    expect(wrapper.find(".ink-dropdown__value").text()).toBe(
      "Select an option"
    );
  });

  it("displays selected option label", () => {
    const wrapper = mount(InkDropdown, {
      props: {
        options: staticOptions,
        modelValue: "opt2",
      },
    });

    expect(wrapper.find(".ink-dropdown__value").text()).toBe("Option 2");
  });

  it("emits update:modelValue when option is selected", async () => {
    const wrapper = mount(InkDropdown, {
      props: {
        options: staticOptions,
        modelValue: "",
        editable: true,
      },
    });

    // Open dropdown
    await wrapper.find(".ink-dropdown").trigger("click");
    await nextTick();

    // Select an option
    const options = wrapper.findAll(".ink-dropdown__option");
    await options[1].trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["opt2"]);
  });

  it("loads lazy options immediately when modelValue is set", async () => {
    const lazyOptions: DropdownOption[] = [
      { label: "Lazy 1", value: "lazy1" },
      { label: "Lazy 2", value: "lazy2" },
      { label: "Lazy 3", value: "lazy3" },
    ];

    const refresher = vi.fn(async () => {
      return Promise.resolve(lazyOptions);
    });

    const wrapper = mount(InkDropdown, {
      props: {
        refresher,
        modelValue: "lazy2",
      },
    });

    // Wait for mounted hook and async loading
    await nextTick();
    await vi.waitFor(() => expect(refresher).toHaveBeenCalled());

    // The refresher should be called immediately on mount
    expect(refresher).toHaveBeenCalledTimes(1);
  });

  it("does not load lazy options immediately when modelValue is empty", async () => {
    const refresher = vi.fn(async () => {
      return Promise.resolve([]);
    });

    mount(InkDropdown, {
      props: {
        refresher,
        modelValue: "",
      },
    });

    await nextTick();

    // Refresher should not be called for empty modelValue
    expect(refresher).not.toHaveBeenCalled();
  });

  it("does not load lazy options immediately when modelValue is null", async () => {
    const refresher = vi.fn(async () => {
      return Promise.resolve([]);
    });

    mount(InkDropdown, {
      props: {
        refresher,
        modelValue: null,
      },
    });

    await nextTick();

    // Refresher should not be called for null modelValue
    expect(refresher).not.toHaveBeenCalled();
  });

  it("does not load lazy options when static options already exist", async () => {
    const refresher = vi.fn(async () => {
      return Promise.resolve([]);
    });

    mount(InkDropdown, {
      props: {
        options: staticOptions,
        refresher,
        modelValue: "opt1",
      },
    });

    await nextTick();

    // Refresher should not be called when options are already provided
    expect(refresher).not.toHaveBeenCalled();
  });

  it("displays refresh button when refresher is provided", () => {
    const wrapper = mount(InkDropdown, {
      props: {
        refresher: async () => [],
      },
    });

    expect(wrapper.find(".ink-dropdown__refresh").exists()).toBe(true);
  });

  it("calls refresher when refresh button is clicked", async () => {
    const refresher = vi.fn(async () => []);

    const wrapper = mount(InkDropdown, {
      props: {
        refresher,
        editable: true,
      },
    });

    await wrapper.find(".ink-dropdown__refresh").trigger("click");
    await nextTick();

    expect(refresher).toHaveBeenCalled();
  });

  describe("stepping", () => {
    const options = [
      { label: "Opt 1", value: "v1" },
      { label: "Opt 2", value: "v2" },
      { label: "Opt 3", value: "v3" },
    ];

    it("loops forward correctly", async () => {
      const wrapper = mount(InkDropdown, {
        props: {
          modelValue: "v1",
          options,
          enableStepping: true,
        },
      });

      const nextBtn = wrapper.findAllComponents(InkButton).at(1);
      await nextBtn?.trigger("click");
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["v2"]);

      await wrapper.setProps({ modelValue: "v3" });
      await nextBtn?.trigger("click");
      expect(wrapper.emitted("update:modelValue")?.[1]).toEqual(["v1"]);
    });

    it("loops backward correctly", async () => {
      const wrapper = mount(InkDropdown, {
        props: {
          modelValue: "v1",
          options,
          enableStepping: true,
        },
      });

      const prevBtn = wrapper.findAllComponents(InkButton).at(0);
      await prevBtn?.trigger("click");
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["v3"]);

      await wrapper.setProps({ modelValue: "v2" });
      await prevBtn?.trigger("click");
      expect(wrapper.emitted("update:modelValue")?.[1]).toEqual(["v1"]);
    });

    it("is disabled when editable is false", () => {
      const wrapper = mount(InkDropdown, {
        props: {
          options,
          enableStepping: true,
          editable: false,
        },
      });

      const buttons = wrapper.findAllComponents(InkButton);
      expect(buttons.at(0)?.find("button").element.disabled).toBe(true);
      expect(buttons.at(1)?.find("button").element.disabled).toBe(true);
    });

    it("is disabled when options are empty", () => {
      const wrapper = mount(InkDropdown, {
        props: {
          options: [],
          enableStepping: true,
        },
      });

      const buttons = wrapper.findAllComponents(InkButton);
      expect(buttons.at(0)?.find("button").element.disabled).toBe(true);
      expect(buttons.at(1)?.find("button").element.disabled).toBe(true);
    });
  });

  describe("keyboard navigation", () => {
    const options: DropdownOption[] = [
      { label: "Option 1", value: "opt1" },
      { label: "Option 2", value: "opt2" },
      { label: "Option 3", value: "opt3" },
    ];

    it("navigates down with ArrowDown key", async () => {
      const wrapper = mount(InkDropdown, {
        props: {
          options,
          modelValue: "",
          editable: true,
        },
      });

      // Open dropdown
      await wrapper.find(".ink-dropdown").trigger("click");
      await nextTick();

      const container = wrapper.find(".ink-dropdown-container");

      // Press ArrowDown
      await container.trigger("keydown", { key: "ArrowDown" });
      await nextTick();

      // First option should be hovered (index 1 after initial 0)
      const optionElements = wrapper.findAll(".ink-dropdown__option");
      expect(optionElements[1].classes()).toContain(
        "ink-dropdown__option--hovered"
      );
    });

    it("navigates up with ArrowUp key", async () => {
      const wrapper = mount(InkDropdown, {
        props: {
          options,
          modelValue: "",
          editable: true,
        },
      });

      // Open dropdown
      await wrapper.find(".ink-dropdown").trigger("click");
      await nextTick();

      const container = wrapper.find(".ink-dropdown-container");

      // Press ArrowUp (should wrap to last option)
      await container.trigger("keydown", { key: "ArrowUp" });
      await nextTick();

      // Last option should be hovered
      const optionElements = wrapper.findAll(".ink-dropdown__option");
      expect(optionElements[2].classes()).toContain(
        "ink-dropdown__option--hovered"
      );
    });

    it("wraps around when navigating past last option", async () => {
      const wrapper = mount(InkDropdown, {
        props: {
          options,
          modelValue: "",
          editable: true,
        },
      });

      // Open dropdown
      await wrapper.find(".ink-dropdown").trigger("click");
      await nextTick();

      const container = wrapper.find(".ink-dropdown-container");

      // Press ArrowDown 3 times (0 -> 1 -> 2 -> 0)
      await container.trigger("keydown", { key: "ArrowDown" });
      await container.trigger("keydown", { key: "ArrowDown" });
      await container.trigger("keydown", { key: "ArrowDown" });
      await nextTick();

      // Should wrap back to first option
      const optionElements = wrapper.findAll(".ink-dropdown__option");
      expect(optionElements[0].classes()).toContain(
        "ink-dropdown__option--hovered"
      );
    });

    it("selects hovered option with Enter key", async () => {
      const wrapper = mount(InkDropdown, {
        props: {
          options,
          modelValue: "",
          editable: true,
        },
      });

      // Open dropdown
      await wrapper.find(".ink-dropdown").trigger("click");
      await nextTick();

      const container = wrapper.find(".ink-dropdown-container");

      // Navigate to second option
      await container.trigger("keydown", { key: "ArrowDown" });
      await nextTick();

      // Press Enter to select
      await container.trigger("keydown", { key: "Enter" });
      await nextTick();

      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["opt2"]);
    });

    it("closes dropdown with Escape key", async () => {
      const wrapper = mount(InkDropdown, {
        props: {
          options,
          modelValue: "",
          editable: true,
        },
      });

      // Open dropdown
      await wrapper.find(".ink-dropdown").trigger("click");
      await nextTick();

      expect(wrapper.find(".ink-dropdown__options").exists()).toBe(true);

      const container = wrapper.find(".ink-dropdown-container");

      // Press Escape
      await container.trigger("keydown", { key: "Escape" });
      await nextTick();

      expect(wrapper.find(".ink-dropdown__options").exists()).toBe(false);
    });

    it("initializes hover to current selection when opening", async () => {
      const wrapper = mount(InkDropdown, {
        props: {
          options,
          modelValue: "opt2",
          editable: true,
        },
      });

      // Open dropdown
      await wrapper.find(".ink-dropdown").trigger("click");
      await nextTick();

      // Second option should be hovered (matching modelValue)
      const optionElements = wrapper.findAll(".ink-dropdown__option");
      expect(optionElements[1].classes()).toContain(
        "ink-dropdown__option--hovered"
      );
    });
  });
});
