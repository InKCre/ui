import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

if (!process.argv[2]) throw new Error("Pass an existing Playwright module path.");
const { chromium, expect } = await import(pathToFileURL(resolve(process.argv[2])).href);
const here = dirname(fileURLToPath(import.meta.url));
const evidence = resolve(here, "../i2-evidence");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 1000 } });
const study = await browser.newPage();
const errors = [],
  requests = [];
for (const tab of [page, study]) {
  tab.on("pageerror", (error) => errors.push(error.message));
  tab.on("request", (request) => {
    if (/^https?:/.test(request.url())) requests.push(request.url());
  });
}
const report = {
  ...JSON.parse(readFileSync(resolve(evidence, "artifact.json"), "utf8")),
  approvedStudySha256: createHash("sha256")
    .update(readFileSync(resolve(here, "index.html")))
    .digest("hex"),
  browser: browser.version(),
  themes: [],
};

// 比较浏览器实际值；冻结样稿与产物分别构建，不从当前 Token 源重算期望值。
const readTheme = (locator) =>
  locator.evaluate((element) => {
    const style = getComputedStyle(element);
    const probe = document.createElement("span");
    element.appendChild(probe);
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

try {
  await study.goto(pathToFileURL(resolve(here, "index.html")).href);
  const expected = {};
  for (const theme of ["light", "dark"]) {
    await study.getByLabel("主题", { exact: true }).selectOption(theme);
    await study.getByLabel("查看", { exact: true }).selectOption("layers");
    const panel = study.locator('[data-palette="candidate"]');
    expected[theme] = {
      tokens: await readTheme(panel),
      shadows: await panel
        .locator(".shadow-sample")
        .evaluateAll((elements) => elements.map((element) => getComputedStyle(element).boxShadow)),
    };
  }
  await page.goto(pathToFileURL(resolve(evidence, "index.html")).href);
  for (const theme of ["light", "dark"]) {
    await page.getByLabel("主题", { exact: true }).selectOption(theme);
    const tokens = await readTheme(page.locator("html"));
    expect(tokens).toEqual(expected[theme].tokens);
    const color = (role) => tokens[`--sys-color-${role}`];
    for (const kind of ["primary", "subtle", "danger"]) {
      const buttons = page.locator(`[data-kind="${kind}"] button`);
      const button = buttons.first();
      const foreground = kind === "subtle" ? "text-base" : `text-on-${kind}`;
      await page.mouse.move(0, 0);
      await expect(button).toHaveCSS("background-color", color(`surface-${kind}`));
      await expect(button).toHaveCSS("color", color(foreground));
      await button.hover();
      await expect(button).toHaveCSS("background-color", color(`surface-${kind}-hover`));
      await page.mouse.down();
      await expect(button).toHaveCSS("background-color", color(`surface-${kind}-hover`));
      await page.mouse.up();
      await button.focus();
      await button.press("Tab");
      await page.keyboard.press("Shift+Tab");
      await expect(button).toBeFocused();
      await expect(button).toHaveCSS("outline-color", color("border-strong"));
      await expect(button).toHaveCSS("outline-width", "2px");
      await expect(buttons.nth(1)).toBeDisabled();
      await expect(buttons.nth(1)).toHaveCSS("background-color", color("surface-subtle"));
      await expect(buttons.nth(1)).toHaveCSS("color", color("text-subtle"));
      await expect(buttons.nth(2)).toBeDisabled();
      await expect(buttons.nth(2)).toHaveCSS("background-color", color(`surface-${kind}`));
      await expect(buttons.nth(2)).toHaveCSS("color", color(foreground));
    }
    const input = page.getByRole("textbox", { name: "来源名称", exact: true });
    await input.focus();
    await input.press("ArrowLeft");
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator(".ink-input")).toHaveCSS("border-color", color("feedback-error"));
    await expect(page.locator(".ink-input")).toHaveCSS("outline-color", color("border-strong"));
    const combo = page.getByRole("combobox", { name: "保存内容", exact: true });
    await combo.focus();
    await combo.press("ArrowDown");
    const listbox = page.getByRole("listbox", { name: "保存内容", exact: true });
    const selected = listbox.getByRole("option", { selected: true });
    await expect(selected).toHaveCSS("background-color", color("surface-primary-hover"));
    for (const selector of [".option__label", ".option__description"]) {
      await expect(selected.locator(selector)).toHaveCSS("color", color("text-on-primary"));
    }
    await combo.press("ArrowDown");
    await expect(selected).toHaveCSS("background-color", color("surface-primary"));
    const next = listbox.getByRole("option", { selected: false });
    await expect(next).toHaveCSS("background-color", color("surface-base-hover"));
    await expect(next.locator(".option__description")).toHaveCSS("color", color("text-subtle"));
    await page.mouse.move(0, 0);
    await settle();
    await page.screenshot({ path: resolve(evidence, `controls-${theme}.png`), fullPage: true });
    await combo.press("Escape");
    await expect(combo).toBeFocused();

    const shadows = [];
    for (const [index, level] of ["low", "md", "high"].entries()) {
      const sass = page.locator(`.sass-shadow-${level}`);
      const uno = page.locator(`.shadow-${level}`);
      await expect(sass).toHaveCSS("box-shadow", expected[theme].shadows[index]);
      const unoShadow = await uno.evaluate((element) => getComputedStyle(element).boxShadow);
      // Wind3 合成透明的 ring 层；比较可见阴影，同时保留完整计算值。
      const painted = unoShadow
        .split(/,(?![^(]*\))/)
        .map((layer) => layer.trim())
        .filter((layer) => !layer.startsWith("rgba(0, 0, 0, 0)"));
      expect(painted).toEqual([expected[theme].shadows[index]]);
      shadows.push({ level, shadow: expected[theme].shadows[index], uno: unoShadow });
    }
    const tooltipTrigger = page.getByRole("button", { name: "连接说明", exact: true });
    await tooltipTrigger.focus();
    const tooltip = page.locator('[role="tooltip"]');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveCSS("box-shadow", expected[theme].shadows[1]);
    await page.evaluate(() =>
      document.documentElement.style.setProperty("--sys-elevation-raised-md-radius", "8px"),
    );
    await expect(page.locator(".sass-shadow-md")).not.toHaveCSS(
      "box-shadow",
      expected[theme].shadows[1],
    );
    await expect(tooltip).toHaveCSS(
      "box-shadow",
      await page
        .locator(".sass-shadow-md")
        .evaluate((element) => getComputedStyle(element).boxShadow),
    );
    await expect(page.locator(".shadow-md")).toHaveCSS("box-shadow", shadows[1].uno);
    await page.evaluate(() =>
      document.documentElement.style.removeProperty("--sys-elevation-raised-md-radius"),
    );
    await tooltipTrigger.press("Escape");
    await expect(tooltip).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator(".uno-pair")).toHaveCSS("background-color", color("surface-primary"));
    await expect(page.locator(".uno-pair")).toHaveCSS("color", color("text-on-primary"));

    await page.getByRole("button", { name: "打开确认", exact: true }).click();
    const popup = page.getByRole("dialog", { name: "设置确认", exact: true });
    await expect(popup).toBeVisible();
    expect(await popup.evaluate((element) => element.parentElement === document.body)).toBe(true);
    await expect(popup).toHaveCSS("background-color", color("surface-base"));
    await expect(popup).toHaveCSS("color", color("text-base"));
    expect(
      await popup.evaluate((element) => getComputedStyle(element, "::backdrop").backgroundColor),
    ).toBe(color("overlay-scrim"));
    const other = theme === "light" ? "dark" : "light";
    await page.evaluate((value) => {
      document.documentElement.dataset.theme = value;
    }, other);
    await expect(popup).toHaveCSS(
      "background-color",
      expected[other].tokens["--sys-color-surface-base"],
    );
    await expect(popup).toHaveCSS("color", expected[other].tokens["--sys-color-text-base"]);
    await page.evaluate((value) => {
      document.documentElement.dataset.theme = value;
    }, theme);
    await page.setViewportSize({ width: 375, height: 900 });
    const popupBounds = await popup.boundingBox();
    expect(popupBounds.x).toBeGreaterThanOrEqual(0);
    expect(popupBounds.x + popupBounds.width).toBeLessThanOrEqual(375);
    for (const button of await popup.getByRole("button").all()) {
      const bounds = await button.boundingBox();
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(375);
    }
    await settle();
    await page.screenshot({ path: resolve(evidence, `popup-${theme}-375.png`) });
    await page.keyboard.press("Escape");
    await expect(popup).not.toBeVisible();
    await expect(page.getByRole("button", { name: "打开确认", exact: true })).toBeFocused();

    await page.getByRole("button", { name: "打开阅读层", exact: true }).click();
    const scrim = page.getByRole("dialog", { name: "阅读内容", exact: true });
    await expect(scrim).toBeVisible();
    expect(await scrim.evaluate((element) => element.parentElement === document.body)).toBe(true);
    await expect(scrim).toHaveCSS("background-color", color("overlay-scrim"));
    await expect(scrim.locator(".scrim-content")).toHaveCSS(
      "background-color",
      color("surface-base"),
    );
    await expect(scrim.locator(".scrim-content")).toHaveCSS("color", color("text-base"));
    await expect(scrim.getByRole("button", { name: "Close", exact: true })).toHaveCSS(
      "background-color",
      color("surface-subtle"),
    );
    await settle();
    await page.screenshot({ path: resolve(evidence, `scrim-${theme}-375.png`) });
    await scrim.getByRole("button", { name: "Close", exact: true }).click();
    await expect(scrim).not.toBeVisible();
    await expect(page.getByRole("button", { name: "打开阅读层", exact: true })).toBeFocused();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await page.setViewportSize({ width: 1000, height: 1000 });
    report.themes.push({
      theme,
      matchedVariables: Object.keys(tokens).length,
      tokens,
      shadows,
      buttons: "normal/hover/pressed/focus/disabled/pending",
      errorWithFocus: true,
      selectedLabelAndDescription: true,
      rootPopupAndScrim: true,
      openPopupThemeChange: true,
      sassRuntimeShadow: true,
      unoBuildTimeShadow: true,
      narrowWidth: 375,
      overflow,
    });
  }
  expect(errors).toEqual([]);
  expect(requests).toEqual([]);
  writeFileSync(
    resolve(evidence, "verification.json"),
    JSON.stringify({ ...report, errors, requests }, null, 2) + "\n",
  );
  console.log(
    JSON.stringify(
      report.themes.map(({ theme, matchedVariables, overflow }) => ({
        theme,
        matchedVariables,
        overflow,
      })),
    ),
  );
} catch (error) {
  await page.screenshot({ path: resolve(evidence, "failure.png"), fullPage: true });
  throw error;
} finally {
  await browser.close();
}
