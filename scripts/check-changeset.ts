import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { readPackageManifest, repositoryRoot, resolveWebPackageRoot } from "./lib/ui-package.js";

const base = process.argv[2];
if (!base) {
  throw new Error("Usage: check-changeset.ts <git-base>");
}

const diff = spawnSync("git", ["diff", "--name-only", `${base}...HEAD`], {
  cwd: repositoryRoot,
  encoding: "utf8",
});
if (diff.status !== 0) {
  process.stderr.write(diff.stderr);
  process.exit(diff.status ?? 1);
}

const changedFiles = diff.stdout.trim().split("\n").filter(Boolean);
const packageRoot = resolveWebPackageRoot();
const packageDirectory = `${packageRoot.slice(repositoryRoot.length + 1)}/`;
const releaseRelevant = changedFiles.some(
  (file) =>
    file.startsWith(packageDirectory) ||
    file === "tokens/inkcre.tokens.json" ||
    file.startsWith("scripts/build-tokens."),
);

if (!releaseRelevant) {
  process.stdout.write("No release-relevant UI package changes found.\n");
  process.exit(0);
}

const versionOnly =
  changedFiles.length > 0 &&
  changedFiles.every(
    (file) =>
      file === `${packageDirectory}package.json` ||
      file === `${packageDirectory}CHANGELOG.md` ||
      file.startsWith(".changeset/"),
  ) &&
  changedFiles.includes(`${packageDirectory}CHANGELOG.md`);
if (versionOnly) {
  process.stdout.write("Changesets release-version change detected.\n");
  process.exit(0);
}

const packageName = readPackageManifest(packageRoot).name;
const changesets = changedFiles.filter(
  (file) =>
    file.startsWith(".changeset/") && file.endsWith(".md") && file !== ".changeset/README.md",
);
const targetsPackage = changesets.some((file) => {
  const contents = readFileSync(resolve(repositoryRoot, file), "utf8");
  return contents.includes(`${JSON.stringify(packageName)}:`);
});

if (!targetsPackage) {
  process.stderr.write(`Release-relevant changes require a changeset for ${packageName}.\n`);
  process.exit(1);
}

process.stdout.write(`Changeset coverage is present for ${packageName}.\n`);
