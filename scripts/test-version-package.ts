import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { test, type TestContext } from "node:test";
import { checkMigration, versionPackage } from "./version-package.js";
import { readPackageManifest, repositoryRoot } from "./lib/ui-package.js";

const require = createRequire(import.meta.url);
const changesetCli = require.resolve("@changesets/cli/bin.js");
const history = "## 1.0.0：已有迁移\n\n保留旧正文和空行。\n\n";
const introduction = "# 迁移指南\n\n既有引言。\n\n";

function fixture(t: TestContext, body = "### 保存流程\n\n升级后复核保存。", changeset = true) {
  const root = fs.mkdtempSync(resolve(tmpdir(), "inkcre-version-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const packageRoot = resolve(root, "packages/web");
  fs.mkdirSync(resolve(packageRoot, "src"), { recursive: true });
  fs.mkdirSync(resolve(root, ".changeset"));
  fs.mkdirSync(resolve(root, "scripts/lib"), { recursive: true });
  fs.symlinkSync(resolve(repositoryRoot, "node_modules"), resolve(root, "node_modules"), "dir");
  fs.writeFileSync(
    resolve(root, "package.json"),
    JSON.stringify({ name: "fixture", private: true, type: "module" }),
  );
  fs.writeFileSync(resolve(root, "pnpm-workspace.yaml"), "packages:\n  - packages/*\n");
  fs.writeFileSync(
    resolve(packageRoot, "package.json"),
    JSON.stringify({ name: "@inkcre/ui-web", version: "1.0.0" }),
  );
  fs.writeFileSync(resolve(packageRoot, "component-manifest.json"), '{"components":[]}');
  fs.copyFileSync(
    resolve(repositoryRoot, ".changeset/config.json"),
    resolve(root, ".changeset/config.json"),
  );
  for (const file of ["build-package-metadata.ts", "lib/ui-package.ts"]) {
    fs.copyFileSync(resolve(repositoryRoot, "scripts", file), resolve(root, "scripts", file));
  }
  if (changeset) {
    fs.writeFileSync(
      resolve(root, ".changeset/migration.md"),
      '---\n"@inkcre/ui-web": patch\n---\n\n调整保存流程。\n',
    );
  }
  const path = resolve(packageRoot, "MIGRATION.md");
  const source =
    introduction + `## 下一版本\n\n<!-- migration-base: 1.0.0 -->\n\n${body}\n\n` + history;
  fs.writeFileSync(path, source);
  const run = (args: string[]) => {
    if (args[0] === "exec") {
      execFileSync(process.execPath, [changesetCli, "version"], { cwd: root, stdio: "pipe" });
    } else {
      execFileSync(process.execPath, ["--import", "tsx", "scripts/build-package-metadata.ts"], {
        cwd: root,
        stdio: "pipe",
      });
    }
  };
  return { root, packageRoot, path, source, run, read: () => fs.readFileSync(path, "utf8") };
}

test("真实 Changesets 版本推进归档一次，并保留引言、正文和历史", (t) => {
  const body = "### 保存流程\n\n```md\n## 下一版本\n```\n\n升级后复核保存。";
  const f = fixture(t, body);
  checkMigration(f.root);
  assert.throws(() => checkMigration(f.root, true), /尚未归档/);
  versionPackage(f.root, f.run);
  const archived = f.read();
  assert.equal(readPackageManifest(f.packageRoot).version, "1.0.1");
  assert.equal(
    archived,
    introduction +
      `## 下一版本\n\n<!-- migration-base: 1.0.1 -->\n\n## 1.0.1\n\n${body}\n\n` +
      history,
  );
  assert.match(fs.readFileSync(resolve(f.packageRoot, "src/version.ts"), "utf8"), /"1.0.1"/);
  checkMigration(f.root, true);
  versionPackage(f.root, f.run);
  assert.equal(f.read(), archived);
});

test("无版本变化不改文件；有版本变化但无迁移只更新基准", (t) => {
  const f = fixture(t, "", false);
  versionPackage(f.root, f.run);
  assert.equal(f.read(), f.source);
  fs.writeFileSync(
    resolve(f.root, ".changeset/migration.md"),
    '---\n"@inkcre/ui-web": minor\n---\n\n新增兼容能力。\n',
  );
  versionPackage(f.root, f.run);
  assert.equal(readPackageManifest(f.packageRoot).version, "1.1.0");
  assert.equal(
    f.read(),
    introduction + "## 下一版本\n\n<!-- migration-base: 1.1.0 -->\n\n" + history,
  );
  checkMigration(f.root, true);
});

test("有迁移但无包版本变化不能通过版本命令或发布检查", (t) => {
  const f = fixture(t, "需要升级操作。", false);
  assert.throws(() => versionPackage(f.root, f.run), /尚未归档/);
  assert.equal(f.read(), f.source);
  assert.throws(() => checkMigration(f.root, true), /尚未归档/);
});

test("Changesets 失败时不归档、不生成元数据", (t) => {
  const f = fixture(t);
  fs.writeFileSync(
    resolve(f.root, ".changeset/migration.md"),
    '---\n"missing-package": patch\n---\n\n错误包。\n',
  );
  assert.throws(() => versionPackage(f.root, f.run));
  assert.equal(f.read(), f.source);
  assert.equal(fs.existsSync(resolve(f.packageRoot, "src/version.ts")), false);
});

test("升版成功后归档写入失败，重跑原操作恢复且仅归档一次", (t) => {
  const f = fixture(t);
  const rename = t.mock.method(fs, "renameSync", () => {
    throw new Error("归档写入失败");
  });
  assert.throws(() => versionPackage(f.root, f.run), /归档写入失败/);
  assert.equal(readPackageManifest(f.packageRoot).version, "1.0.1");
  assert.equal(f.read(), f.source);
  assert.equal(
    fs.readdirSync(f.packageRoot).some((name) => name.startsWith(".migration-")),
    false,
  );
  rename.mock.restore();
  versionPackage(f.root, f.run);
  checkMigration(f.root, true);
  assert.equal(f.read().match(/^## 1\.0\.1$/gm)?.length, 1);
  assert.ok(f.read().endsWith(history));
});

test("元数据失败后重跑保留归档并补齐元数据", (t) => {
  const f = fixture(t);
  assert.throws(
    () =>
      versionPackage(f.root, (args) => {
        if (args[0] === "build-package-metadata") throw new Error("元数据生成失败");
        f.run(args);
      }),
    /元数据生成失败/,
  );
  const archived = f.read();
  versionPackage(f.root, f.run);
  assert.equal(f.read(), archived);
  assert.match(fs.readFileSync(resolve(f.packageRoot, "src/version.ts"), "utf8"), /"1.0.1"/);
});

test("恢复未完成归档后才处理下一批 Changeset", (t) => {
  const f = fixture(t);
  fs.writeFileSync(
    resolve(f.packageRoot, "package.json"),
    JSON.stringify({ name: "@inkcre/ui-web", version: "1.0.1" }),
  );
  versionPackage(f.root, f.run);
  assert.equal(readPackageManifest(f.packageRoot).version, "1.0.2");
  assert.match(f.read(), /migration-base: 1\.0\.2/);
  assert.equal(f.read().match(/^## 1\.0\.1$/gm)?.length, 1);
  assert.doesNotMatch(f.read(), /^## 1\.0\.2$/m);
});

test("歧义结构、未来基准和已有目标历史在任何版本命令前拒绝", (t) => {
  const f = fixture(t);
  const invalid = [
    f.source.replace("## 下一版本", "## 未发布"),
    f.source + "\n## 下一版本\n",
    f.source.replace("### 保存流程", "## 保存流程"),
    f.source + "\n```md\n未闭合代码块\n",
    f.source.replace("migration-base: 1.0.0", "migration-base: 2.0.0"),
    f.source.replace("migration-base: 1.0.0", "migration-base: 1.0.0-beta.1"),
    f.source.replace("<!-- migration-base: 1.0.0 -->", ""),
    f.source.replace("migration-base: 1.0.0", "migration-base: 0.9.0"),
  ];
  for (const source of invalid) {
    fs.writeFileSync(f.path, source);
    let called = false;
    assert.throws(() =>
      versionPackage(f.root, () => {
        called = true;
      }),
    );
    assert.equal(called, false);
    assert.equal(f.read(), source);
  }
});
