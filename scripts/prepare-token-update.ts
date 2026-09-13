import assert from "node:assert/strict";
import {
  openSync,
  closeSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { readPackageManifest, repositoryRoot, resolveWebPackageRoot } from "./lib/ui-package.js";
import { isRecord, isToken, validateTokenSource } from "./lib/token-source.js";

interface TokenUpdate {
  filename: string;
  payload: unknown;
  changesetId: string;
  summary: string;
  packageName: string;
  releaseType: string;
}

const generatedFiles = [
  "packages/web/styles/tokens/_ref.scss",
  "packages/web/styles/tokens/_sys.scss",
  "packages/web/styles/tokens/_comp.scss",
  "packages/web/styles/uno/preset-ink.ts",
];

function mergeValues(source: Record<string, unknown>, payload: unknown, path = ""): void {
  if (!isRecord(payload) || !Object.keys(payload).length) {
    throw new Error(`Token payload must contain a non-empty type/value group: ${path}`);
  }
  for (const [key, incoming] of Object.entries(payload)) {
    const current = Object.hasOwn(source, key) ? source[key] : undefined;
    const name = path ? `${path}.${key}` : key;
    if (!isRecord(current) || !isRecord(incoming)) {
      throw new Error(`Unknown or removed token path; migrate the contract explicitly: ${name}`);
    }
    if (!isToken(current)) {
      if (isToken(incoming)) throw new Error(`Cannot replace a token group: ${name}`);
      mergeValues(current, incoming, name);
      continue;
    }
    if (!isToken(incoming) || incoming.type !== current.type) {
      throw new Error(`Token type change requires a contract migration: ${name}`);
    }
    const references = (value: unknown) =>
      JSON.stringify(value).match(/\{[a-zA-Z0-9_.-]+\}/g) ?? [];
    if (JSON.stringify(references(current.value)) !== JSON.stringify(references(incoming.value))) {
      throw new Error(`Alias changes require a contract migration: ${name}`);
    }
    if (incoming.description != null && incoming.description !== current.description) {
      throw new Error(`Repository-owned description conflicts at ${name}`);
    }
    // Metadata and omitted roles stay under repository ownership.
    current.value = incoming.value;
  }
}

function runGenerator(targetRoot: string): void {
  const result = spawnSync(
    "pnpm",
    ["--dir", repositoryRoot, "exec", "tsx", "scripts/build-tokens.ts", "--root", targetRoot],
    {
      cwd: repositoryRoot,
      stdio: "inherit",
    },
  );
  if (result.status !== 0)
    throw new Error("Candidate token generation failed; source was not updated");
}

export function prepareTokenUpdate(
  targetRoot: string,
  update: TokenUpdate,
): { changed: boolean; tokenPath: string; changesetPath: string } {
  if (update.filename !== "inkcre.tokens.json")
    throw new Error("Token filename must be inkcre.tokens.json");
  if (!/^[a-z0-9][a-z0-9-]{2,100}$/.test(update.changesetId))
    throw new Error("Changeset id must be a lowercase, collision-safe slug");
  if (!["patch", "minor", "major"].includes(update.releaseType))
    throw new Error("Maintainer must explicitly choose releaseType: patch, minor, or major");
  const summary = update.summary.replace(/\s+/g, " ").trim();
  if (!summary || summary.length > 160)
    throw new Error("Token update summary must contain 1-160 characters");

  const tokenPath = resolve(targetRoot, "tokens", update.filename);
  const changesetPath = resolve(targetRoot, ".changeset", `${update.changesetId}.md`);
  if (existsSync(changesetPath)) throw new Error(`Changeset already exists: ${update.changesetId}`);
  const original = readFileSync(tokenPath, "utf8");
  const source: unknown = JSON.parse(original);
  validateTokenSource(source);
  const payload: unknown =
    typeof update.payload === "string" ? JSON.parse(update.payload) : update.payload;
  mergeValues(source, payload);
  validateTokenSource(source);
  const candidate = `${JSON.stringify(source, null, 2)}\n`;
  if (JSON.stringify(JSON.parse(original)) === JSON.stringify(source))
    return { changed: false, tokenPath, changesetPath };

  const staging = mkdtempSync(resolve(tmpdir(), "inkcre-token-candidate-"));
  try {
    mkdirSync(resolve(staging, "tokens"));
    writeFileSync(resolve(staging, "tokens/inkcre.tokens.json"), candidate);
    runGenerator(staging);
    const writes = new Map<string, string>([
      [tokenPath, candidate],
      [
        changesetPath,
        `---\n${JSON.stringify(update.packageName)}: ${update.releaseType}\n---\n\n${summary}\n`,
      ],
      ...generatedFiles.map((file): [string, string] => [
        resolve(targetRoot, file),
        readFileSync(resolve(staging, file), "utf8"),
      ]),
    ]);
    const previous = new Map(
      [...writes.keys()].map((path) => [path, existsSync(path) ? readFileSync(path) : null]),
    );
    const written: string[] = [];
    try {
      for (const [path, content] of writes) {
        mkdirSync(dirname(path), { recursive: true });
        // Claim new files before recording them; an exclusive-open failure owns nothing to undo.
        const descriptor = openSync(path, previous.get(path) === null ? "wx" : "w");
        written.push(path);
        try {
          writeFileSync(descriptor, content);
        } finally {
          closeSync(descriptor);
        }
      }
    } catch (error) {
      for (const path of written.reverse()) {
        const content = previous.get(path);
        if (content) writeFileSync(path, content);
        else rmSync(path, { force: true });
      }
      throw error;
    }
    return { changed: true, tokenPath, changesetPath };
  } finally {
    rmSync(staging, { recursive: true, force: true });
  }
}

function runFixture(): void {
  const temporaryRoot = mkdtempSync(resolve(tmpdir(), "inkcre-token-workflow-"));
  const packageName = readPackageManifest(resolveWebPackageRoot()).name;
  const sourcePath = resolve(repositoryRoot, "tokens/inkcre.tokens.json");
  try {
    mkdirSync(resolve(temporaryRoot, "tokens"));
    const tokenPath = resolve(temporaryRoot, "tokens/inkcre.tokens.json");
    writeFileSync(tokenPath, readFileSync(sourcePath));
    const source = JSON.parse(readFileSync(sourcePath, "utf8"));
    const update: TokenUpdate = {
      filename: "inkcre.tokens.json",
      payload: {
        ref: { space: { md: { type: "dimension", value: 24 } } },
        sys: { light: { color: { overlay: { scrim: { type: "color", value: "#00000080" } } } } },
        effect: {
          elevation: {
            raised: {
              low: {
                ...source.effect.elevation.raised.low,
                value: { ...source.effect.elevation.raised.low.value, radius: 4 },
              },
            },
          },
        },
      },
      changesetId: "figma-fixture-1",
      summary: "验证受限 Token 值更新。",
      packageName,
      releaseType: "minor",
    };
    const result = prepareTokenUpdate(temporaryRoot, update);
    assert.equal(result.changed, true);
    const actual = JSON.parse(readFileSync(tokenPath, "utf8"));
    source.ref.space.md.value = 24;
    source.sys.light.color.overlay.scrim.value = "#00000080";
    source.effect.elevation.raised.low.value.radius = 4;
    assert.deepEqual(
      actual,
      source,
      "Omitted roles and repository metadata must survive a partial export",
    );
    assert.ok(
      readFileSync(result.changesetPath, "utf8").includes(`${JSON.stringify(packageName)}: minor`),
    );
    for (const file of generatedFiles) assert.ok(existsSync(resolve(temporaryRoot, file)));
    assert.equal(
      prepareTokenUpdate(temporaryRoot, { ...update, changesetId: "figma-noop-1" }).changed,
      false,
    );
    assert.equal(existsSync(resolve(temporaryRoot, ".changeset/figma-noop-1.md")), false);

    assert.match(readFileSync(resolve(temporaryRoot, generatedFiles[1]), "utf8"), /#00000080/i);
    const baseline = readFileSync(tokenPath, "utf8");
    const generatedBaseline = generatedFiles.map((file) =>
      readFileSync(resolve(temporaryRoot, file), "utf8"),
    );
    const failures = [
      { releaseType: "" },
      { changesetId: update.changesetId },
      { payload: { ref: { space: { unknown: { type: "dimension", value: 8 } } } } },
      { payload: { ref: { space: { md: { type: "number", value: 24 } } } } },
      { payload: { ref: { space: { md: { type: "dimension", value: "bad" } } } } },
      {
        payload: {
          ref: {
            typo: {
              family: {
                sans: {
                  ...source.ref.typo.family.sans,
                  description: "Replace repository guidance",
                },
              },
            },
          },
        },
      },
      {
        payload: {
          sys: {
            light: {
              color: { text: { base: { type: "color", value: "{ref.color.neutral.40}" } } },
            },
          },
        },
      },
      {
        payload: { typography: { label: { sm: { fontSize: { type: "dimension", value: 10 } } } } },
      },
    ];
    for (const failure of failures) {
      assert.throws(() =>
        prepareTokenUpdate(temporaryRoot, {
          ...update,
          changesetId: "figma-invalid-1",
          ...failure,
        }),
      );
      assert.equal(readFileSync(tokenPath, "utf8"), baseline);
      assert.deepEqual(
        generatedFiles.map((file) => readFileSync(resolve(temporaryRoot, file), "utf8")),
        generatedBaseline,
      );
      assert.equal(existsSync(resolve(temporaryRoot, ".changeset/figma-invalid-1.md")), false);
    }
    const cycle = structuredClone(source);
    // 构造闭环的两端，避免依赖当前正文恰好引用哪一级中性色。
    cycle.sys.light.color.text.base.value = "{ref.color.neutral.2}";
    cycle.ref.color.neutral["2"].value = "{sys.light.color.text.base}";
    const cycleRoot = resolve(temporaryRoot, "cycle");
    mkdirSync(resolve(cycleRoot, "tokens"), { recursive: true });
    writeFileSync(resolve(cycleRoot, "tokens/inkcre.tokens.json"), JSON.stringify(cycle));
    assert.throws(() => runGenerator(cycleRoot));
    assert.equal(existsSync(resolve(cycleRoot, generatedFiles[0])), false);
    process.stdout.write(
      "Token import accepted a partial value update, preserved metadata, and rejected unsafe contract changes.\n",
    );
  } finally {
    rmSync(temporaryRoot, { recursive: true, force: true });
  }
}

const command = process.argv[2];
if (command === "fixture") runFixture();
else if (command === "apply") {
  const result = prepareTokenUpdate(repositoryRoot, {
    filename: process.env.INKCRE_TOKEN_FILENAME ?? "",
    payload: process.env.INKCRE_TOKEN_JSON ?? "",
    changesetId: process.env.INKCRE_CHANGESET_ID ?? "",
    summary: process.env.INKCRE_CHANGESET_SUMMARY ?? "更新设计 Token。",
    packageName: readPackageManifest(resolveWebPackageRoot()).name,
    releaseType: process.env.INKCRE_CHANGESET_RELEASE ?? "",
  });
  process.stdout.write(
    result.changed
      ? "Token candidate and changeset prepared.\n"
      : "Token values are unchanged; no changeset created.\n",
  );
} else throw new Error("Usage: prepare-token-update.ts <apply|fixture>");
