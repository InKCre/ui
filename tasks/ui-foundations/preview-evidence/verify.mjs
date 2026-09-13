// 本任务的远端 Histoire 复验，复用已安装的 Playwright。
import { pathToFileURL } from "node:url";
import { readFile, writeFile } from "node:fs/promises";
const { chromium, expect } = await import(pathToFileURL(process.argv[2]).href);
const origin = process.argv[3];
const expected = JSON.parse(
  await readFile(new URL("../i2-evidence/verification.json", import.meta.url)),
);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 375, height: 800 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const report = { origin, browser: browser.version(), checks: [], errors };
const output = (name) => new URL(name, import.meta.url).pathname;
async function story(id, variant, theme) {
  await page.goto(`${origin}/__sandbox.html?storyId=${id}&variantId=${id}-${variant}`);
  await page.locator("button, input, .story-debug").first().waitFor();
  await page.evaluate(
    (theme) => document.documentElement.classList.toggle("dark", theme === "dark"),
    theme,
  );
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
}
try {
  for (const theme of ["light", "dark"]) {
    await story("stories-controls-inkswitch-story-vue", 6, theme);
    const values = await page.locator("html").evaluate((root) => {
      const style = getComputedStyle(root),
        probe = document.createElement("span");
      root.append(probe);
      const values = Object.fromEntries(
        Array.from(style)
          .filter(
            (name) =>
              name.startsWith("--sys-color-") ||
              name.startsWith("--comp-switch-") ||
              name.startsWith("--sys-elevation-raised-"),
          )
          .sort()
          .map((name) => {
            let value = style.getPropertyValue(name).trim();
            if (CSS.supports("color", value)) {
              probe.style.color = value;
              value = getComputedStyle(probe).color;
            }
            return [name, value];
          }),
      );
      probe.remove();
      return values;
    });
    expect(values).toEqual(expected.themes.find((t) => t.theme === theme).tokens);
    const toggle = page.getByRole("switch", { name: "通知开关", exact: true });
    const before = await toggle.boundingBox();
    await toggle.press("Space");
    await expect(toggle).toHaveAttribute("aria-checked", "true");
    expect((await toggle.boundingBox()).width).toBe(before.width);
    await expect(toggle).toHaveCSS("font-family", "system-ui, -apple-system, sans-serif");
    await expect(page.getByRole("switch", { name: "等待中的通知开关" })).toBeDisabled();
    await page.screenshot({ path: output(`switch-${theme}-375.png`) });
    await story("stories-media-inkimage-story-vue", 3, theme);
    const thumbnail = page.getByRole("button", { name: "InKCre 标志", exact: true });
    await thumbnail.press("Enter");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(thumbnail).toBeFocused();
    await story("stories-media-inkimage-story-vue", 5, theme);
    await page.getByRole("button", { name: "InKCre 标志", exact: true }).click();
    const download = page.waitForEvent("download");
    await page.getByRole("link", { name: "下载原图（SVG）" }).click();
    expect((await download).suggestedFilename()).toBe("inkcre.svg");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.screenshot({ path: output(`image-${theme}-375.png`) });
    await story("stories-controls-inkbutton-story-vue", 13, theme);
    await page.getByRole("button", { name: "普通动作", exact: true }).click();
    await expect(page.getByText("提交次数：0")).toBeVisible();
    await page.getByRole("button", { name: "提交", exact: true }).click();
    await expect(page.getByText("提交次数：1")).toBeVisible();
    report.checks.push({
      theme,
      matchedVariables: Object.keys(values).length,
      switch: "keyboard, width, sans, pending",
      image: "keyboard, Escape, focus return, real SVG download",
      button: "native submit",
    });
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(origin);
  await page.getByText("Controls", { exact: true }).click();
  await page.getByRole("link", { name: /^Switch/ }).click();
  await page.getByRole("link", { name: "长状态文案保持轨道尺寸", exact: true }).click();
  await expect(page.locator("pre").filter({ hasText: "v-model" }).first()).toBeVisible();
  await page.getByRole("switch", { name: "通知开关", exact: true }).click();
  await page.screenshot({ path: output("story-source.png") });
  report.checks.push({ histoire: "variant controls, reactive update and rendered source" });
  expect(errors).toEqual([]);
  await writeFile(output("verification.json"), JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report));
} finally {
  await browser.close();
}
