import { pathToFileURL, fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";

if (!process.argv[2]) throw new Error("Pass an existing Playwright module path.");
const { chromium, expect } = await import(pathToFileURL(resolve(process.argv[2])).href);
const here = dirname(fileURLToPath(import.meta.url));
const rgb = (hex) =>
  hex
    .slice(1, 7)
    .match(/../g)
    .map((part) => parseInt(part, 16));
const cssRgb = (hex) => `rgb(${rgb(hex).join(", ")})`;
function luminance(hex) {
  const [r, g, b] = rgb(hex)
    .map((value) => value / 255)
    .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  return r * 0.2126 + g * 0.7152 + b * 0.0722;
}
function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
function measurePairs(colors) {
  const text = [],
    boundaries = [];
  const add = (list, foreground, background, threshold) => {
    const ratio = contrast(colors[foreground], colors[background]);
    list.push({ foreground, background, ratio, threshold });
  };
  for (const surface of ["base", "subtle", "base-hover", "subtle-hover"]) {
    for (const role of [
      "text-base",
      "text-subtle",
      "feedback-success",
      "feedback-warning",
      "feedback-info",
      "feedback-error",
    ])
      add(text, `--sys-color-${role}`, `--sys-color-surface-${surface}`, 4.5);
    for (const role of ["border-base", "border-strong", "feedback-error"])
      add(boundaries, `--sys-color-${role}`, `--sys-color-surface-${surface}`, 3);
  }
  for (const role of ["primary", "danger"])
    for (const state of ["", "-hover"])
      add(text, `--sys-color-text-on-${role}`, `--sys-color-surface-${role}${state}`, 4.5);
  add(text, "--comp-switch-label-color", "--comp-switch-handle-bg", 4.5);
  add(boundaries, "--comp-switch-track-bg", "--comp-switch-handle-bg", 3);
  const minimum = (list) => list.reduce((a, b) => (a.ratio < b.ratio ? a : b));
  return {
    textPairs: text.length,
    boundaryPairs: boundaries.length,
    minimumText: minimum(text),
    minimumBoundary: minimum(boundaries),
    failures: [...text, ...boundaries].filter((pair) => pair.ratio < pair.threshold),
  };
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1080 } });
const errors = [],
  requests = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("request", (request) => {
  if (/^https?:/.test(request.url())) requests.push(request.url());
});
const report = {
  ...JSON.parse(readFileSync(resolve(here, "artifact.json"), "utf8")),
  browser: browser.version(),
  colors: [],
  interactions: [],
  feedback: [],
  shadows: [],
  narrow: [],
};
const settle = () =>
  page.waitForFunction(() =>
    document
      .getAnimations()
      .every(
        (animation) =>
          animation.effect?.getComputedTiming().iterations === Infinity ||
          animation.playState !== "running",
      ),
  );
const paletteOf = (panel) =>
  panel.evaluate((element) =>
    Object.fromEntries(
      Array.from(getComputedStyle(element))
        .filter((name) => name.startsWith("--sys-color-") || name.startsWith("--comp-switch-"))
        .map((name) => [name, getComputedStyle(element).getPropertyValue(name).trim()]),
    ),
  );
try {
  await page.goto(pathToFileURL(resolve(here, "index.html")).href);
  await expect(page.locator("[data-palette]")).toHaveCount(2);
  for (const theme of ["light", "dark"]) {
    await page.getByLabel("主题", { exact: true }).selectOption(theme);
    await page.getByLabel("查看", { exact: true }).selectOption("scene");
    await page
      .locator('[data-palette="current"]')
      .getByRole("button", { name: "取消", exact: true })
      .click();
    await page.mouse.move(0, 0);
    await settle();
    await page.screenshot({ path: resolve(here, `scene-${theme}.png`), fullPage: true });
    for (const id of ["current", "candidate"]) {
      const panel = page.locator(`[data-palette="${id}"]`);
      const colors = await paletteOf(panel);
      const measured = measurePairs(colors);
      report.colors.push({ theme, palette: id, ...measured });
      if (id === "candidate") expect(measured.failures).toEqual([]);
      await expect(
        panel.locator(".source-row .success, .source-row .warning, .source-row .info"),
      ).toHaveCount(0);
      await panel.getByRole("button", { name: "保存设置", exact: true }).click();
      await expect(panel.getByRole("status")).toHaveCSS(
        "color",
        cssRgb(colors["--sys-color-text-subtle"]),
      );
    }
    await page.getByLabel("表单状态", { exact: true }).selectOption("error");
    for (const id of ["current", "candidate"]) {
      const panel = page.locator(`[data-palette="${id}"]`);
      const input = panel.getByRole("textbox", { name: "来源名称", exact: true });
      await input.focus();
      await input.press("ArrowLeft");
      await expect(input).toHaveAttribute("aria-invalid", "true");
      const colors = await paletteOf(panel);
      await expect(panel.locator(".ink-input")).toHaveCSS(
        "border-color",
        cssRgb(colors["--sys-color-feedback-error"]),
      );
      await expect(panel.locator(".ink-input")).toHaveCSS(
        "outline-color",
        cssRgb(colors["--sys-color-border-strong"]),
      );
      await expect(panel.locator(".ink-input")).toHaveCSS("outline-width", "2px");
    }
    await page.getByLabel("表单状态", { exact: true }).selectOption("pending");
    for (const id of ["current", "candidate"]) {
      const panel = page.locator(`[data-palette="${id}"]`);
      const button = panel.getByRole("button", { name: "保存设置", exact: true });
      const colors = await paletteOf(panel);
      await expect(button).toBeDisabled();
      await expect(button).toHaveCSS(
        "background-color",
        cssRgb(colors["--sys-color-surface-primary"]),
      );
      await expect(button).toHaveCSS("color", cssRgb(colors["--sys-color-text-on-primary"]));
      await expect(panel.getByRole("status")).toHaveCSS(
        "color",
        cssRgb(colors["--sys-color-text-subtle"]),
      );
    }
    await page.getByLabel("表单状态", { exact: true }).selectOption("normal");
    await page.getByLabel("查看", { exact: true }).selectOption("states");
    for (const kind of ["normal", "success", "warning", "info", "error"]) {
      await page.getByLabel("反馈情境", { exact: true }).selectOption(kind);
      for (const id of ["current", "candidate"]) {
        const panel = page.locator(`[data-palette="${id}"]`);
        const colors = await paletteOf(panel);
        const feedback = panel.locator(".feedback-example");
        await expect(feedback).toHaveCount(1);
        await expect(feedback).toHaveAttribute("data-feedback", kind);
        const titleColor =
          colors[kind === "normal" ? "--sys-color-text-subtle" : `--sys-color-feedback-${kind}`];
        await expect(feedback.locator(".feedback-title")).toHaveCSS("color", cssRgb(titleColor));
        await expect(feedback.locator(".feedback-detail")).toHaveCSS(
          "color",
          cssRgb(colors["--sys-color-text-base"]),
        );
        report.feedback.push({
          theme,
          palette: id,
          kind,
          titleColor,
          detailColor: colors["--sys-color-text-base"],
        });
      }
    }
    await page.getByLabel("反馈情境", { exact: true }).selectOption("warning");
    await page.getByLabel("查看", { exact: true }).selectOption("scene");
    await page
      .locator('[data-palette="current"]')
      .getByRole("button", { name: "取消", exact: true })
      .click();
    await page.getByLabel("查看", { exact: true }).selectOption("states");
    await page.mouse.move(0, 0);
    await settle();
    await page.screenshot({ path: resolve(here, `states-${theme}.png`), fullPage: true });
    for (const id of ["current", "candidate"])
      for (const kind of ["primary", "subtle", "danger"]) {
        const panel = page.locator(`[data-palette="${id}"]`);
        const colors = await paletteOf(panel);
        const button = panel.locator(`[data-kind="${kind}"] button`).first();
        await page.mouse.move(0, 0);
        await expect(button).toHaveCSS(
          "background-color",
          cssRgb(colors[`--sys-color-surface-${kind}`]),
        );
        await button.hover();
        await expect(button).toHaveCSS(
          "background-color",
          cssRgb(colors[`--sys-color-surface-${kind}-hover`]),
        );
        await page.mouse.down();
        await expect(button).toHaveCSS(
          "background-color",
          cssRgb(colors[`--sys-color-surface-${kind}-hover`]),
        );
        await page.mouse.up();
        await button.focus();
        await page.keyboard.press("Tab");
        await page.keyboard.press("Shift+Tab");
        await expect(button).toBeFocused();
        await expect(button).toHaveCSS("outline-width", "2px");
        const disabled = panel.locator(`[data-kind="${kind}"] button`).nth(1);
        await expect(disabled).toBeDisabled();
        await expect(disabled).toHaveCSS(
          "background-color",
          cssRgb(colors["--sys-color-surface-subtle"]),
        );
      }
    report.interactions.push({
      theme,
      errorBorderWithFocus: true,
      pendingKeepsPrimaryPair: true,
      routineStatusUsesNeutralText: true,
      buttonStates: "primary/subtle/danger: normal, hover, pressed, focus, disabled",
    });
    await page.getByLabel("查看", { exact: true }).selectOption("layers");
    const buttons = page.getByRole("button", { name: "连接说明", exact: true });
    await buttons.first().focus();
    await buttons.nth(1).hover();
    await settle();
    for (const id of ["current", "candidate"]) {
      const tooltip = page.locator(`[data-palette="${id}"] [role="tooltip"]`);
      await expect(tooltip).toBeVisible();
      await expect(tooltip).toHaveAttribute("aria-hidden", "false");
      report.shadows.push({
        theme,
        palette: id,
        shadow: await tooltip.evaluate((element) => getComputedStyle(element).boxShadow),
      });
    }
    await page.screenshot({ path: resolve(here, `layers-${theme}.png`), fullPage: true });
    await buttons.nth(1).focus();
    await page.keyboard.press("Escape");
    await expect(page.locator('[data-palette="candidate"] [role="tooltip"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    await page.setViewportSize({ width: 375, height: 900 });
    for (const view of ["scene", "states", "layers"]) {
      await page.getByLabel("查看", { exact: true }).selectOption(view);
      if (view === "layers") {
        await page
          .locator('[data-palette="candidate"]')
          .getByRole("button", { name: "连接说明", exact: true })
          .focus();
        const bounds = await page
          .locator('[data-palette="candidate"] [role="tooltip"]')
          .boundingBox();
        expect(bounds.x).toBeGreaterThanOrEqual(0);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(375);
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(overflow).toBeLessThanOrEqual(1);
      report.narrow.push({ theme, view, width: 375, overflow });
    }
    await page.setViewportSize({ width: 1280, height: 1080 });
  }
  expect(errors).toEqual([]);
  expect(requests).toEqual([]);
  writeFileSync(
    resolve(here, "verification.json"),
    JSON.stringify({ ...report, errors, networkRequests: requests }, null, 2) + "\n",
  );
  console.log(
    JSON.stringify(
      report.colors.map(({ theme, palette, minimumText, minimumBoundary, failures }) => ({
        theme,
        palette,
        minimumText: minimumText.ratio,
        minimumBoundary: minimumBoundary.ratio,
        failures: failures.length,
      })),
    ),
  );
} catch (error) {
  await page.screenshot({ path: resolve(here, "failure.png"), fullPage: true });
  throw error;
} finally {
  await browser.close();
}
