import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolveWebPackageRoot } from "./lib/ui-package.js";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageRoot = resolveWebPackageRoot(repositoryRoot);
const packageDirectory = relative(repositoryRoot, packageRoot);
const generatedPaths = [
  `${packageDirectory}/styles/tokens`,
  `${packageDirectory}/styles/uno/preset-ink.ts`,
  `${packageDirectory}/agent-skills`,
  `${packageDirectory}/src/public-components.ts`,
  `${packageDirectory}/src/components.d.ts`,
  `${packageDirectory}/src/version.ts`,
];

function listFiles(path: string): string[] {
  const absolutePath = resolve(repositoryRoot, path);

  if (!statSync(absolutePath).isDirectory()) {
    return [absolutePath];
  }

  return readdirSync(absolutePath, { withFileTypes: true })
    .flatMap((entry) => {
      const childPath = resolve(absolutePath, entry.name);
      return entry.isDirectory() ? listFiles(relative(repositoryRoot, childPath)) : [childPath];
    })
    .sort();
}

function readGeneratedState(): Map<string, Buffer> {
  return new Map(
    generatedPaths
      .flatMap(listFiles)
      .map((path) => [relative(repositoryRoot, path), readFileSync(path)]),
  );
}

function runGenerator(script: string) {
  const result = spawnSync("pnpm", [script], {
    cwd: repositoryRoot,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const before = readGeneratedState();
runGenerator("build-tokens");
runGenerator("build-package-metadata");
runGenerator("build-skills");
const after = readGeneratedState();

const changed = [...new Set([...before.keys(), ...after.keys()])].filter(
  (path) => !before.get(path)?.equals(after.get(path) ?? Buffer.alloc(0)),
);

if (changed.length > 0) {
  process.stderr.write(
    `Generated files were stale:\n${changed.map((path) => `- ${path}`).join("\n")}\n`,
  );
  process.exit(1);
}

process.stdout.write("Generated files are current.\n");
