import { afterEach, describe, expect, it } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import InkImage from "./inkImage.vue";

const defaultProps = {
  src: "https://example.com/image.jpg",
  alt: "Test image",
};

const mountedWrappers: VueWrapper[] = [];

const mountImage = (
  options: Parameters<typeof mount<typeof InkImage>>[1] = {}
) => {
  const wrapper = mount(InkImage, {
    ...options,
    props: {
      ...defaultProps,
      ...options.props,
    },
    global: {
      ...options.global,
      stubs: {
        Teleport: {
          template: "<div><slot /></div>",
        },
        Transition: {
          template: "<div><slot /></div>",
        },
        ...options.global?.stubs,
      },
    },
  });

  mountedWrappers.push(wrapper);
  return wrapper;
};

const openImage = async (wrapper: VueWrapper) => {
  await wrapper.get("[data-testid='ink-image-thumbnail']").trigger("click");
};

afterEach(() => {
  mountedWrappers.splice(0).forEach((wrapper) => wrapper.unmount());
});

describe("InkImage", () => {
  describe("rendering", () => {
    it("renders the thumbnail with accessible image attributes", () => {
      const wrapper = mountImage();
      const image = wrapper.get("[data-testid='ink-image-img']");

      expect(image.attributes("src")).toBe(defaultProps.src);
      expect(image.attributes("alt")).toBe(defaultProps.alt);
      expect(image.attributes("loading")).toBe("lazy");
    });

    it("supports a custom thumbnail", () => {
      const wrapper = mountImage({
        slots: {
          thumbnail: "<div class='custom-thumbnail'>Custom</div>",
        },
      });

      expect(wrapper.get(".custom-thumbnail").text()).toBe("Custom");
      expect(
        wrapper.find("[data-testid='ink-image-img']").exists()
      ).toBe(false);
    });

    it("shows the expanded title and custom header", async () => {
      const wrapper = mountImage({
        props: {
          title: "Test Image Title",
        },
        slots: {
          "expanded-header": "<div class='custom-header'>Header</div>",
        },
      });

      await openImage(wrapper);

      expect(wrapper.get("[data-testid='ink-scrim']").exists()).toBe(true);
      expect(wrapper.get(".custom-header").text()).toBe("Header");
      expect(wrapper.get(".ink-image__expanded-title").text()).toBe(
        "Test Image Title"
      );
    });
  });

  describe("expanded state", () => {
    it("opens from the thumbnail and publishes the state change", async () => {
      const wrapper = mountImage();

      expect(wrapper.find("[data-testid='ink-scrim']").exists()).toBe(false);

      await openImage(wrapper);

      expect(wrapper.get("[data-testid='ink-scrim']").exists()).toBe(true);
      expect(wrapper.emitted("expand")).toHaveLength(1);
      expect(wrapper.emitted("update:expanded")).toEqual([[true]]);
    });

    it("closes from the scrim and publishes the close action", async () => {
      const wrapper = mountImage();
      await openImage(wrapper);

      await wrapper.get("[data-testid='ink-scrim']").trigger("click");

      expect(wrapper.find("[data-testid='ink-scrim']").exists()).toBe(false);
      expect(wrapper.emitted("close")).toHaveLength(1);
      expect(wrapper.emitted("update:expanded")).toEqual([[true], [false]]);
    });

    it("closes on Escape", async () => {
      const wrapper = mountImage();
      await openImage(wrapper);

      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      await wrapper.vm.$nextTick();

      expect(wrapper.find("[data-testid='ink-scrim']").exists()).toBe(false);
      expect(wrapper.emitted("close")).toHaveLength(1);
      expect(wrapper.emitted("update:expanded")).toEqual([[true], [false]]);
    });

    it("leaves a controlled model unchanged until its parent updates it", async () => {
      const wrapper = mountImage({
        props: {
          expanded: false,
        },
      });

      await openImage(wrapper);

      expect(wrapper.emitted("update:expanded")).toEqual([[true]]);
      expect(wrapper.find("[data-testid='ink-scrim']").exists()).toBe(false);

      await wrapper.setProps({ expanded: true });
      expect(wrapper.get("[data-testid='ink-scrim']").exists()).toBe(true);

      await wrapper.get("[data-testid='ink-scrim']").trigger("click");
      expect(wrapper.emitted("update:expanded")).toEqual([[true], [false]]);
      expect(wrapper.get("[data-testid='ink-scrim']").exists()).toBe(true);

      await wrapper.setProps({ expanded: false });
      expect(wrapper.find("[data-testid='ink-scrim']").exists()).toBe(false);
    });
  });

  it("emits the failed source with image load errors", async () => {
    const wrapper = mountImage();

    await wrapper.get("[data-testid='ink-image-img']").trigger("error");

    expect(wrapper.emitted("error")).toHaveLength(1);
    expect(wrapper.emitted("error")?.[0]?.[0]).toMatchObject({
      src: defaultProps.src,
    });
  });
});
