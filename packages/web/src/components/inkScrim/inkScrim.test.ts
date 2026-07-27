import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import InkScrim from "./inkScrim.vue";

describe("InkScrim", () => {
  const mountOptions = {
    global: {
      stubs: {
        Teleport: {
          template: "<div><slot /></div>",
        },
        Transition: {
          template: "<div><slot /></div>",
        },
      },
    },
  };

  describe("rendering", () => {
    it("renders scrim overlay when open is true", async () => {
      const wrapper = mount(InkScrim, {
        ...mountOptions,
        props: {
          open: true,
        },
      });

      expect(wrapper.find("[data-testid='ink-scrim']").exists()).toBe(true);
    });

    it("does not render scrim when open is false", () => {
      const wrapper = mount(InkScrim, {
        ...mountOptions,
        props: {
          open: false,
        },
      });

      expect(wrapper.find("[data-testid='ink-scrim']").exists()).toBe(false);
    });
  });

  describe("close functionality", () => {
    it("closes scrim when clicked if closeOnScrim is true", async () => {
      const wrapper = mount(InkScrim, {
        ...mountOptions,
        props: {
          open: true,
          closeOnScrim: true,
        },
      });

      expect(wrapper.vm.open).toBe(true);

      const scrim = wrapper.find("[data-testid='ink-scrim']");
      await scrim.trigger("click");

      expect(wrapper.vm.open).toBe(false);
    });

    it("emits scrim-click event when scrim is clicked", async () => {
      const wrapper = mount(InkScrim, {
        ...mountOptions,
        props: {
          open: true,
        },
      });

      const scrim = wrapper.find("[data-testid='ink-scrim']");
      await scrim.trigger("click");

      expect(wrapper.emitted("scrim-click")).toHaveLength(1);
    });

    it("does not close scrim when clicked if closeOnScrim is false", async () => {
      const wrapper = mount(InkScrim, {
        ...mountOptions,
        props: {
          open: true,
          closeOnScrim: false,
        },
      });

      const scrim = wrapper.find("[data-testid='ink-scrim']");
      await scrim.trigger("click");

      expect(wrapper.vm.open).toBe(true);
    });

    it("closes once when the close button is clicked", async () => {
      const wrapper = mount(InkScrim, {
        ...mountOptions,
        props: {
          open: true,
          showCloseButton: true,
        },
      });

      await wrapper.get("[data-testid='ink-scrim-close-btn']").trigger("click");

      expect(wrapper.emitted("close")).toHaveLength(1);
      expect(wrapper.emitted("update:open")).toEqual([[false]]);
      expect(wrapper.emitted("scrim-click")).toBeUndefined();
    });
  });

  describe("v-model:open", () => {
    it("updates open state via v-model", async () => {
      const wrapper = mount(InkScrim, {
        ...mountOptions,
        props: {
          open: false,
        },
      });

      expect(wrapper.vm.open).toBe(false);

      await wrapper.setProps({ open: true });

      expect(wrapper.vm.open).toBe(true);
    });
  });

  describe("transitions", () => {
    it("applies fade transition when opening", async () => {
      const wrapper = mount(InkScrim, {
        ...mountOptions,
        props: {
          open: false,
        },
      });

      await wrapper.setProps({ open: true });

      const transition = wrapper.findComponent({ name: "Transition" });
      expect(transition.props("name")).toBe("ink-scrim-fade");
    });
  });
});
