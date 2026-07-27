import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { readPackageManifest, repositoryRoot, resolveWebPackageRoot } from "./lib/ui-package.js";

interface TokenUpdate {
  filename: string;
  payload: unknown;
  changesetId: string;
  summary: string;
  packageName: string;
}

function normalizePayload(payload: unknown): Record<string, unknown> {
  let value = payload;
  if (typeof value === "string") {
    value = JSON.parse(value) as unknown;
  }
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    Object.keys(value).length === 0
  ) {
    throw new Error("Token payload must be a non-empty JSON object");
  }
  return value as Record<string, unknown>;
}

export function prepareTokenUpdate(
  targetRoot: string,
  update: TokenUpdate,
): { tokenPath: string; changesetPath: string } {
  if (update.filename !== "inkcre.tokens.json") {
    throw new Error("Token filename must be inkcre.tokens.json");
  }
  if (!/^[a-z0-9][a-z0-9-]{2,100}$/.test(update.changesetId)) {
    throw new Error("Changeset id must be a lowercase, collision-safe slug");
  }

  const summary = update.summary.replace(/\s+/g, " ").trim();
  if (!summary || summary.length > 160) {
    throw new Error("Token update summary must contain 1-160 characters");
  }

  const tokenPath = resolve(targetRoot, "tokens", update.filename);
  const changesetPath = resolve(targetRoot, ".changeset", `${update.changesetId}.md`);
  mkdirSync(resolve(targetRoot, "tokens"), { recursive: true });
  mkdirSync(resolve(targetRoot, ".changeset"), { recursive: true });
  writeFileSync(
    tokenPath,
    `${JSON.stringify(normalizePayload(update.payload), null, 2)}\n`,
    "utf8",
  );
  writeFileSync(
    changesetPath,
    `---\n${JSON.stringify(update.packageName)}: patch\n---\n\n${summary}\n`,
    { encoding: "utf8", flag: "wx" },
  );

  return { tokenPath, changesetPath };
}

function runGenerator(targetRoot: string): void {
  const result = spawnSync(
    "pnpm",
    [
      "--dir",
      repositoryRoot,
      "exec",
      "tsx",
      "scripts/build-tokens.ts",
      "--root",
      targetRoot,
      "tokens/inkcre.tokens.json",
    ],
    { cwd: repositoryRoot, stdio: "inherit" },
  );
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runFixture(): void {
  const temporaryRoot = mkdtempSync(resolve(tmpdir(), "inkcre-token-workflow-"));
  const packageName = readPackageManifest(resolveWebPackageRoot()).name;

  try {
    const source = JSON.parse(
      readFileSync(resolve(repositoryRoot, "tokens/inkcre.tokens.json"), "utf8"),
    ) as unknown;
    const result = prepareTokenUpdate(temporaryRoot, {
      filename: "inkcre.tokens.json",
      payload: source,
      changesetId: "figma-12345-1",
      summary: "Update design tokens from the deterministic Figma fixture.",
      packageName,
    });
    runGenerator(temporaryRoot);

    const generatedFiles = [
      "packages/web/styles/tokens/_ref.scss",
      "packages/web/styles/tokens/_sys.scss",
      "packages/web/styles/tokens/_comp.scss",
      "packages/web/styles/uno/preset-ink.ts",
    ];
    for (const generatedFile of generatedFiles) {
      if (!existsSync(resolve(temporaryRoot, generatedFile))) {
        throw new Error(`Token fixture did not generate ${generatedFile}`);
      }
    }
    const changeset = readFileSync(result.changesetPath, "utf8");
    if (!changeset.includes(`${JSON.stringify(packageName)}: patch`)) {
      throw new Error("Token fixture changeset targets the wrong package");
    }

    process.stdout.write(
      "Token workflow fixture produced source, generated artifacts, and a changeset.\n",
    );
  } finally {
    rmSync(temporaryRoot, { recursive: true, force: true });
  }
}

function runApply(): void {
  const packageName = readPackageManifest(resolveWebPackageRoot()).name;
  prepareTokenUpdate(repositoryRoot, {
    filename: process.env.INKCRE_TOKEN_FILENAME ?? "",
    payload: process.env.INKCRE_TOKEN_JSON ?? "",
    changesetId: process.env.INKCRE_CHANGESET_ID ?? "",
    summary: process.env.INKCRE_CHANGESET_SUMMARY ?? "Update design tokens from Figma.",
    packageName,
  });
  runGenerator(repositoryRoot);
}

const command = process.argv[2];
if (command === "fixture") {
  runFixture();
} else if (command === "apply") {
  runApply();
} else {
  throw new Error("Usage: prepare-token-update.ts <apply|fixture>");
}
