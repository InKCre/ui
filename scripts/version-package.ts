import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { readPackageManifest, repositoryRoot, resolveWebPackageRoot } from "./lib/ui-package.js";

function versionParts(version: string): number[] {
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)) {
    throw new Error(`迁移归档只支持正式版本，收到 ${version}`);
  }
  return version.split(".").map(Number);
}

function readMigration(root: string) {
  const packageRoot = resolveWebPackageRoot(root);
  const { version } = readPackageManifest(packageRoot);
  const path = resolve(packageRoot, "MIGRATION.md");
  const source = fs.readFileSync(path, "utf8");
  const headings: { title: string; start: number; end: number }[] = [];
  let offset = 0;
  let fence = "";
  for (const line of source.split(/(?<=\n)/)) {
    const delimiter = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (fence) {
      const closing = line.match(/^ {0,3}(`{3,}|~{3,})[ \t]*\r?\n?$/);
      if (closing?.[1][0] === fence[0] && closing[1].length >= fence.length) fence = "";
    } else if (delimiter) {
      fence = delimiter[1];
    } else {
      const heading = line.match(/^## (.+?)\r?\n?$/);
      if (heading) headings.push({ title: heading[1], start: offset, end: offset + line.length });
    }
    offset += line.length;
  }
  if (fence) throw new Error("MIGRATION.md 存在未闭合的代码块，无法确认迁移章节边界");
  const pending = headings.filter(({ title }) => title === "下一版本");
  if (pending.length !== 1 || pending[0] !== headings[0]) {
    throw new Error("MIGRATION.md 必须以唯一的二级标题「下一版本」作为第一个章节");
  }
  const historyVersions = headings.slice(1).map(({ title }) => {
    const match = title.match(/^(\d+\.\d+\.(?:\d+|x))(?=[:：\s]|$)/);
    if (!match) throw new Error(`迁移历史标题必须标明版本；待定小节请使用三级标题：${title}`);
    return match[1];
  });
  const start = pending[0].end;
  const end = headings[1]?.start ?? source.length;
  const section = source.slice(start, end);
  const baseline = section.match(/^\s*<!-- migration-base: ([^\s]+) -->\r?\n/);
  if (!baseline || (section.match(/<!-- migration-base:/g) ?? []).length !== 1) {
    throw new Error("下一版本区必须以唯一的 <!-- migration-base: x.y.z --> 标记开始");
  }
  const base = versionParts(baseline[1]);
  const current = versionParts(version);
  const firstDifference = base.findIndex((part, index) => part !== current[index]);
  if (firstDifference >= 0 && base[firstDifference] > current[firstDifference]) {
    throw new Error(`迁移基准 ${baseline[1]} 高于包版本 ${version}，请检查版本与文档`);
  }
  const body = section.slice(baseline[0].length).trim();
  const needsArchive = baseline[1] !== version;
  if (needsArchive && body && historyVersions.includes(version)) {
    throw new Error(`MIGRATION.md 已存在 ${version}，拒绝覆盖历史；请检查未完成的版本变更`);
  }
  return { path, source, version, start, end, body, needsArchive };
}

function archiveMigration(root: string): void {
  const migration = readMigration(root);
  if (!migration.needsArchive) return;
  const archived = migration.body ? `## ${migration.version}\n\n${migration.body}\n\n` : "";
  const next =
    migration.source.slice(0, migration.start) +
    `\n<!-- migration-base: ${migration.version} -->\n\n` +
    archived +
    migration.source.slice(migration.end);
  const temporary = fs.mkdtempSync(resolve(dirname(migration.path), ".migration-"));
  try {
    const staged = resolve(temporary, "MIGRATION.md");
    fs.writeFileSync(staged, next);
    fs.renameSync(staged, migration.path);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
}

export function checkMigration(root: string, forPublish = false): void {
  const migration = readMigration(root);
  if (forPublish && (migration.body || migration.needsArchive)) {
    throw new Error(
      "迁移说明尚未归档；请运行 pnpm changeset:version，并确认 Web 包有对应 Changeset",
    );
  }
}

export function versionPackage(
  root: string,
  run: (args: string[]) => void = (args) =>
    execFileSync("pnpm", args, { cwd: root, stdio: "inherit" }),
): void {
  // Recover an interrupted archive before Changesets can consume another release's input.
  archiveMigration(root);
  run(["exec", "changeset", "version"]);
  archiveMigration(root);
  checkMigration(root, true);
  run(["build-package-metadata"]);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const mode = process.argv[2];
    if (mode === "--check" || mode === "--check-publish") {
      checkMigration(repositoryRoot, mode === "--check-publish");
    } else if (mode === undefined) {
      versionPackage(repositoryRoot);
    } else {
      throw new Error(`未知参数 ${mode}`);
    }
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}
