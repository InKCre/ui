import { describe, expect, test } from "vitest";
import { installThemeBridge, resolveStoryTheme, synchronizeStoryTheme } from "./theme";

describe("Histoire theme bridge", () => {
  test("maps the catalog light and dark classes to the token theme", async () => {
    const root = document.createElement("html");

    expect(resolveStoryTheme(root)).toBe("light");
    expect(synchronizeStoryTheme(root)).toBe("light");
    expect(root.dataset.theme).toBe("light");

    const disconnect = installThemeBridge(root);
    root.classList.add("dark");
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(root.dataset.theme).toBe("dark");
    disconnect();
  });
});
