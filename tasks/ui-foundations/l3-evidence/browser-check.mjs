import { pathToFileURL } from "node:url";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const { chromium } = await import(pathToFileURL(resolve(process.argv[2])).href);
import { writeFileSync } from "node:fs";
import assert from "node:assert/strict";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 480, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const report = { browser: browser.version(), checks: [] };
const out = dirname(fileURLToPath(import.meta.url)) + "/";
try {
  await page.goto(process.argv[3] ?? "http://127.0.0.1:5203/");
  const input = page.getByRole("textbox", { name: "名称", exact: true });
  await input.fill("协作空间");
  const save = page.getByRole("button", { name: "保存设置", exact: true });
  await save.click();
  assert.equal(await save.isDisabled(), true);
  assert.equal(await input.isDisabled(), true);
  assert.match(await save.innerText(), /保存设置/);
  await page.getByRole("status").filter({ hasText: "设置已保存。" }).waitFor();
  report.checks.push("设置保存：pending 保留文字并禁用，完成后显示成功");
  await page.getByLabel("模拟保存失败").check();
  await input.fill("保留的草稿");
  await save.click();
  await page.getByText("保存失败，请稍后重试。", { exact: true }).waitFor();
  assert.equal(await input.inputValue(), "保留的草稿");
  report.checks.push("设置失败：可见错误且保留草稿");
  const jsonSave = page.getByRole("button", { name: "保存配置", exact: true });
  await page.waitForFunction(() =>
    [...document.querySelectorAll("button")].some(
      (b) => b.textContent.includes("保存配置") && !b.disabled,
    ),
  );
  const editor = page.locator("#json .cm-content");
  await editor.fill('{"name":');
  await page.waitForFunction(() =>
    [...document.querySelectorAll("button")].some(
      (b) => b.textContent.includes("保存配置") && b.disabled,
    ),
  );
  assert.match(await editor.innerText(), /\{"name":/);
  report.checks.push("JSON 不完整输入保留原文，保存禁用");
  await editor.fill('{"name":"新的配置"}');
  await page.getByLabel("模拟保存失败").uncheck();
  await page.waitForFunction(() =>
    [...document.querySelectorAll("button")].some(
      (b) => b.textContent.includes("保存配置") && !b.disabled,
    ),
  );
  await jsonSave.click();
  await page.getByRole("status").filter({ hasText: "配置已保存。" }).waitFor();
  await editor.press("Escape");
  report.checks.push("JSON 验证通过后可解析保存");
  await page.getByRole("button", { name: "切换路由", exact: true }).click();
  assert.match(await page.locator("#integration").innerText(), /扩展/);
  await page.getByRole("button", { name: "查看设置说明" }).click();
  await page.getByRole("dialog").waitFor();
  await page.getByRole("button", { name: "Confirm", exact: true }).click();
  await page.getByRole("button", { name: "切换语言", exact: true }).click();
  await page.getByRole("combobox", { name: "主题", exact: true }).selectOption("dark");
  await page.getByRole("button", { name: "查看设置说明" }).click();
  await page.getByRole("button", { name: "确认", exact: true }).waitFor();
  assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), "dark");
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .every(
        (animation) =>
          animation.effect?.getComputedTiming().iterations === Infinity ||
          animation.playState !== "running",
      ),
  );
  await page.screenshot({ path: out + "integration-dark.png", fullPage: true });
  report.checks.push("路由和语言响应式更新，Dialog 采用根级深色主题");
  await page.getByRole("button", { name: "确认", exact: true }).click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await page.getByRole("combobox", { name: "主题", exact: true }).selectOption("light");
  await page.setViewportSize({ width: 320, height: 1000 });
  await page.locator("#settings h1").click();
  report.viewport320 = await page.evaluate(() => ({
    width: innerWidth,
    overflow: document.documentElement.scrollWidth - innerWidth,
  }));
  assert.ok(report.viewport320.overflow <= 1);
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .every(
        (animation) =>
          animation.effect?.getComputedTiming().iterations === Infinity ||
          animation.playState !== "running",
      ),
  );
  await page.screenshot({ path: out + "recipes-320.png", fullPage: true });
  assert.deepEqual(errors, []);
  report.pageErrors = errors;
  writeFileSync(out + "browser.json", JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report));
} finally {
  await browser.close();
}
