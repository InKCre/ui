import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import InkDialog from "./inkDialog.vue";
import { INK_I18N_KEY } from "../../i18n";

const transitionStubs = {
  Teleport: {
    template: "<div><slot /></div>",
  },
  Transition: {
    template: "<div><slot /></div>",
  },
};

describe("InkDialog", () => {
  it("renders its public content and default actions", () => {
    const wrapper = mount(InkDialog, {
      props: {
        modelValue: true,
        title: "Test Dialog",
        subtitle: "Test Subtitle",
      },
      global: {
        stubs: transitionStubs,
      },
    });

    expect(wrapper.get(".ink-dialog__title").text()).toBe("Test Dialog");
    expect(wrapper.get(".ink-dialog__subtitle").text()).toBe("Test Subtitle");
    expect(wrapper.text()).toContain("Cancel");
    expect(wrapper.text()).toContain("Confirm");
  });

  it("emits cancel and requests closing when the cancel action is clicked", async () => {
    const wrapper = mount(InkDialog, {
      props: {
        modelValue: true,
      },
      global: {
        stubs: transitionStubs,
      },
    });

    const cancelButton = wrapper
      .findAll("button")
      .find((button) => button.text() === "Cancel");
    expect(cancelButton).toBeDefined();

    await cancelButton!.trigger("click");

    expect(wrapper.emitted("cancel")).toHaveLength(1);
    expect(wrapper.emitted("update:modelValue")).toEqual([[false]]);
  });

  it("emits confirm when the confirm action is clicked", async () => {
    const wrapper = mount(InkDialog, {
      props: {
        modelValue: true,
      },
      global: {
        stubs: transitionStubs,
      },
    });

    const confirmButton = wrapper
      .findAll("button")
      .find((button) => button.text() === "Confirm");
    expect(confirmButton).toBeDefined();

    await confirmButton!.trigger("click");

    expect(wrapper.emitted("confirm")).toHaveLength(1);
  });

  it("supports custom action visibility and text", () => {
    const wrapper = mount(InkDialog, {
      props: {
        modelValue: true,
        showCancel: false,
        confirmText: "Continue",
      },
      global: {
        stubs: transitionStubs,
      },
    });

    expect(wrapper.text()).not.toContain("Cancel");
    expect(wrapper.text()).toContain("Continue");
  });

  it("applies position without closing when scrim close is disabled", async () => {
    const wrapper = mount(InkDialog, {
      props: {
        modelValue: true,
        position: "left",
        closeOnScrim: false,
      },
      global: {
        stubs: transitionStubs,
      },
    });

    expect(wrapper.get(".ink-popup").classes()).toContain("ink-popup--left");

    await wrapper.get(".ink-popup-overlay").trigger("click");

    expect(wrapper.find(".ink-dialog").exists()).toBe(true);
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("renders translated action labels when i18n is provided", () => {
    const mockI18n = {
      t: (key: string) =>
        ({
          "dialog.cancel": "Translated Cancel",
          "dialog.confirm": "Translated Confirm",
        })[key] ?? key,
      locale: { value: "en" },
    };

    const wrapper = mount(InkDialog, {
      props: {
        modelValue: true,
      },
      global: {
        stubs: transitionStubs,
        provide: {
          [INK_I18N_KEY as symbol]: mockI18n,
        },
      },
    });

    expect(wrapper.text()).toContain("Translated Cancel");
    expect(wrapper.text()).toContain("Translated Confirm");
  });
});
