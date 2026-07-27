import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import InkJsonEditor from "./inkJsonEditor.vue";
import { jsonService } from "./jsonSchemaService";

// Mock the jsonService.configure method
vi.mock("./jsonSchemaService", () => ({
  jsonService: {
    configure: vi.fn(),
    parseJSONDocument: vi.fn(() => ({})),
    doValidation: vi.fn(async () => []),
    doComplete: vi.fn(async () => null),
  },
}));

describe("InkJsonEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("configures schema on mount when schema prop is provided", async () => {
    const schema = {
      type: "object",
      properties: {
        name: { type: "string" },
      },
    };

    mount(InkJsonEditor, {
      props: {
        modelValue: "{}",
        schema,
        schemaUri: "test://schema.json",
      },
    });

    await nextTick();

    expect(jsonService.configure).toHaveBeenCalledWith({
      schemas: [
        {
          uri: "test://schema.json",
          fileMatch: ["*"],
          schema,
        },
      ],
    });
  });

  it("reconfigures schema when schema prop changes", async () => {
    const initialSchema = {
      type: "object",
      properties: {
        name: { type: "string" },
      },
    };

    const updatedSchema = {
      type: "object",
      properties: {
        name: { type: "string" },
        version: { type: "string" },
      },
    };

    const wrapper = mount(InkJsonEditor, {
      props: {
        modelValue: "{}",
        schema: initialSchema,
        schemaUri: "test://schema.json",
      },
    });

    await nextTick();
    const initialCallCount = (jsonService.configure as any).mock.calls.length;

    await wrapper.setProps({ schema: updatedSchema });
    await nextTick();

    const finalCallCount = (jsonService.configure as any).mock.calls.length;
    expect(finalCallCount).toBeGreaterThan(initialCallCount);
    
    const lastCall = (jsonService.configure as any).mock.calls[finalCallCount - 1];
    expect(lastCall[0]).toEqual({
      schemas: [
        {
          uri: "test://schema.json",
          fileMatch: ["*"],
          schema: updatedSchema,
        },
      ],
    });
  });

  it("does not configure schema when schema prop is not provided", async () => {
    mount(InkJsonEditor, {
      props: {
        modelValue: "{}",
      },
    });

    await nextTick();

    expect(jsonService.configure).toHaveBeenCalledWith({
      schemas: [],
    });
  });

  it("clears schema configuration when schema prop becomes undefined", async () => {
    const initialSchema = {
      type: "object",
      properties: {
        name: { type: "string" },
      },
    };

    const wrapper = mount(InkJsonEditor, {
      props: {
        modelValue: "{}",
        schema: initialSchema,
        schemaUri: "test://schema.json",
      },
    });

    await nextTick();
    vi.clearAllMocks();

    await wrapper.setProps({ schema: undefined });
    await nextTick();

    expect(jsonService.configure).toHaveBeenCalledWith({
      schemas: [],
    });
  });
});
