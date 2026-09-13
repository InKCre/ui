// 本任务的 Header 回归验收，复用现有 Playwright 与正式 Story 构建。
import { pathToFileURL } from "node:url";
import { writeFile } from "node:fs/promises";
const { chromium, expect } = await import(pathToFileURL(process.argv[2]).href);
const origin = process.argv[3];
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const report = { origin, browser: browser.version(), checks: [], errors };
try {
  for (const theme of ["light", "dark"]) {
    for (const width of [375, 1280]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(
        `${origin}/__sandbox.html?storyId=stories-controls-inkheader-story-vue&variantId=stories-controls-inkheader-story-vue-0`,
      );
      const menu = page.getByRole("button", { name: "Menu", exact: true });
      await menu.waitFor();
      await page.evaluate(
        (theme) => document.documentElement.classList.toggle("dark", theme === "dark"),
        theme,
      );
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const glyph = menu.locator('[aria-hidden="true"]');
      await expect(glyph).toBeVisible();
      await expect(glyph).not.toHaveCSS("mask-image", "none");
      await expect(glyph).toHaveCSS("width", "24px");
      await expect(glyph).toHaveCSS("height", "24px");
      const foreground = await menu.evaluate((e) => getComputedStyle(e).color);
      await expect(glyph).toHaveCSS("background-color", foreground);
      await expect(glyph).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
      await expect(menu).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
      await expect(menu).toHaveCSS("mask-image", "none");
      const bounds = await menu.boundingBox();
      expect(bounds.width).toBeGreaterThanOrEqual(24);
      expect(bounds.height).toBeGreaterThanOrEqual(24);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
      await glyph.click();
      await expect(page.locator("output")).toHaveText("菜单点击次数：1");
      await menu.press("Enter");
      await expect(page.locator("output")).toHaveText("菜单点击次数：2");
      await menu.press("Space");
      await expect(page.locator("output")).toHaveText("菜单点击次数：3");
      await expect(menu).toBeFocused();
      await expect(menu).toHaveCSS("outline-style", "solid");
      await expect(menu).toHaveCSS("outline-width", "2px");
      await page
        .locator(".ink-header")
        .screenshot({ path: new URL(`header-${theme}-${width}.png`, import.meta.url).pathname });
      report.checks.push({
        theme,
        width,
        foreground,
        bounds,
        menuEvents: 3,
        mask: "visible child glyph; unmasked button and focus outline",
      });
    }
  }
  expect(errors).toEqual([]);
  await writeFile(
    new URL("verification.json", import.meta.url),
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(JSON.stringify(report));
} finally {
  await browser.close();
}
