import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import * as sass from "sass";
import {
  readComponentManifest,
  readPackageManifest,
  repositoryRoot,
  resolveWebPackageRoot,
} from "./lib/ui-package.js";

interface PublishedPackageManifest {
  dependencies?: Record<string, string>;
  files?: string[];
  keywords?: string[];
  name: string;
  peerDependencies?: Record<string, string>;
  version: string;
  exports: Record<string, unknown>;
  sideEffects?: string[];
}

const packageRoot = resolveWebPackageRoot();
const packageManifest = readPackageManifest(packageRoot);
const publicComponents = readComponentManifest(packageRoot);
const targetPackageName = process.argv[2] ?? packageManifest.name;
const temporaryRoot = mkdtempSync(join(tmpdir(), "inkcre-ui-contract-"));

function run(
  command: string,
  args: string[],
  options: { cwd?: string; capture?: boolean } = {},
): string {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? repositoryRoot,
    encoding: "utf8",
    stdio: options.capture ? "pipe" : "inherit",
  });

  if (result.status !== 0) {
    if (options.capture) {
      process.stderr.write(result.stdout ?? "");
      process.stderr.write(result.stderr ?? "");
    }
    throw new Error(`${command} ${args.join(" ")} failed`);
  }

  return result.stdout ?? "";
}

function ensureParent(path: string): void {
  mkdirSync(dirname(path), { recursive: true });
}

function linkDependency(dependency: string, consumerModules: string): void {
  const source = resolve(packageRoot, "node_modules", dependency);
  if (!existsSync(source)) {
    throw new Error(`Missing installed peer dependency: ${dependency}`);
  }

  const destination = resolve(consumerModules, dependency);
  ensureParent(destination);
  symlinkSync(source, destination, "junction");
}

function assertNoDeclarationLeaks(
  packedRoot: string,
  packedManifest: PublishedPackageManifest,
): void {
  const declarationFiles = readdirSync(resolve(packedRoot, "dist"), {
    recursive: true,
    withFileTypes: true,
  })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".d.ts"))
    .map((entry) => resolve(entry.parentPath, entry.name));

  for (const declarationFile of declarationFiles) {
    const declaration = readFileSync(declarationFile, "utf8");
    if (
      declaration.includes(".pnpm/") ||
      declaration.includes("node_modules/") ||
      declaration.includes("../src/")
    ) {
      throw new Error(`Declaration leaks workspace paths: ${declarationFile}`);
    }

    const moduleSpecifiers = [
      ...declaration.matchAll(/(?:from\s+|import\s*\()\s*["']([^"']+)["']/g),
      ...declaration.matchAll(/import\s+["']([^"']+)["']/g),
    ].map((match) => match[1]);
    const relativeSpecifiers = [
      ...moduleSpecifiers.filter((specifier) => specifier.startsWith(".")),
      ...[...declaration.matchAll(/<reference\s+path=["'](\.[^"']+)["']/g)].map(
        (match) => match[1],
      ),
    ];

    for (const specifier of relativeSpecifiers) {
      const target = resolve(dirname(declarationFile), specifier);
      const candidates = [
        target,
        `${target}.d.ts`,
        `${target}.ts`,
        `${target}.tsx`,
        resolve(target, "index.d.ts"),
      ];
      const relativeTarget = relative(packedRoot, target);
      if (
        relativeTarget.startsWith("..") ||
        !candidates.some((candidate) => existsSync(candidate) && lstatSync(candidate).isFile())
      ) {
        throw new Error(
          `Declaration import does not resolve inside the packed artifact: ${declarationFile} -> ${specifier}`,
        );
      }
    }

    const declaredDependencies = new Set([
      ...Object.keys(packedManifest.dependencies ?? {}),
      ...Object.keys(packedManifest.peerDependencies ?? {}),
    ]);
    for (const specifier of moduleSpecifiers.filter(
      (candidate) => !candidate.startsWith(".") && !candidate.startsWith("node:"),
    )) {
      const dependency = specifier.startsWith("@")
        ? specifier.split("/").slice(0, 2).join("/")
        : specifier.split("/")[0];
      if (!declaredDependencies.has(dependency)) {
        throw new Error(
          `Declaration imports an undeclared package dependency: ${declarationFile} -> ${dependency}`,
        );
      }
    }
  }
}

function listFiles(root: string): string[] {
  return readdirSync(root, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => resolve(entry.parentPath, entry.name))
    .sort();
}

function assertSkillTree(packedRoot: string): void {
  const skillRoot = resolve(packedRoot, "skills/ui-web");
  const skillFiles = listFiles(skillRoot);
  const markdownFiles = skillFiles.filter((path) => path.endsWith(".md"));

  if (existsSync(resolve(packedRoot, "agent-skills"))) {
    throw new Error("Packed artifact still exposes the retired agent-skills path");
  }
  if (existsSync(resolve(packedRoot, "skill.seed.json"))) {
    throw new Error("Packed artifact exposes maintainer-only skill.seed.json");
  }
  if (markdownFiles.length === 0) {
    throw new Error("Packed artifact contains no UI skill Markdown");
  }

  for (const markdownFile of markdownFiles) {
    const content = readFileSync(markdownFile, "utf8");
    if (
      content.includes("src/components/") ||
      content.includes("stories/") ||
      content.includes("../")
    ) {
      throw new Error(`Packed skill leaks repository paths: ${markdownFile}`);
    }

    const markdownTargets = [...content.matchAll(/\]\(([^)]+\.md)\)/g)].map((match) => match[1]);
    const routedTargets = [...content.matchAll(/`(references\/[^`*]+\.md)`/g)].map(
      (match) => match[1],
    );
    const targets = [
      ...markdownTargets.map((target) => resolve(dirname(markdownFile), target)),
      ...routedTargets.map((target) => resolve(skillRoot, target)),
    ];

    for (const target of targets) {
      if (!lstatSync(target).isFile()) {
        throw new Error(`Packed skill reference is missing: ${target}`);
      }
    }
  }
}

try {
  const sourcePackRoot = resolve(temporaryRoot, "source-pack");
  mkdirSync(sourcePackRoot);
  run("pnpm", ["--filter", packageManifest.name, "pack", "--pack-destination", sourcePackRoot]);

  const tarballs = readdirSync(sourcePackRoot).filter((file) => file.endsWith(".tgz"));
  if (tarballs.length !== 1) {
    throw new Error(`Expected one package tarball, found ${tarballs.length}`);
  }

  let extractionRoot = resolve(temporaryRoot, "extracted");
  mkdirSync(extractionRoot);
  run("tar", ["-xzf", resolve(sourcePackRoot, tarballs[0]), "-C", extractionRoot]);

  if (targetPackageName !== packageManifest.name) {
    const identityRoot = resolve(extractionRoot, "package");
    const identityManifestPath = resolve(identityRoot, "package.json");
    const identityManifest = JSON.parse(readFileSync(identityManifestPath, "utf8")) as {
      name: string;
    };
    identityManifest.name = targetPackageName;
    writeFileSync(identityManifestPath, `${JSON.stringify(identityManifest, null, 2)}\n`, "utf8");

    const identityPackRoot = resolve(temporaryRoot, "identity-pack");
    mkdirSync(identityPackRoot);
    run("npm", ["pack", "--ignore-scripts", "--pack-destination", identityPackRoot], {
      cwd: identityRoot,
    });
    const identityTarballs = readdirSync(identityPackRoot).filter((file) => file.endsWith(".tgz"));
    if (identityTarballs.length !== 1) {
      throw new Error(`Expected one identity tarball, found ${identityTarballs.length}`);
    }

    extractionRoot = resolve(temporaryRoot, "identity-extracted");
    mkdirSync(extractionRoot);
    run("tar", ["-xzf", resolve(identityPackRoot, identityTarballs[0]), "-C", extractionRoot]);
  }

  const packedRoot = resolve(extractionRoot, "package");
  const packedManifest = JSON.parse(
    readFileSync(resolve(packedRoot, "package.json"), "utf8"),
  ) as PublishedPackageManifest;
  if (
    packedManifest.name !== targetPackageName ||
    packedManifest.version !== packageManifest.version
  ) {
    throw new Error("Packed package identity differs from the source manifest");
  }
  if (
    !packedManifest.files?.includes("skills") ||
    !packedManifest.keywords?.includes("tanstack-intent")
  ) {
    throw new Error("Packed package metadata does not advertise Intent skills");
  }

  const requiredFiles = [
    "dist/index.js",
    "dist/index.d.ts",
    "dist/components.d.ts",
    "dist/index.css",
    "dist/utils/index.js",
    "dist/utils/index.d.ts",
    "dist/locales/index.js",
    "dist/locales/index.d.ts",
    "dist/uno/preset-ink.js",
    "dist/uno/preset-ink.d.ts",
    "styles/index.scss",
    "styles/_functions.scss",
    "styles/_mixins.scss",
    "styles/tokens/_ref.scss",
    "styles/tokens/_sys.scss",
    "styles/tokens/_comp.scss",
    "styles/uno/preset-ink.ts",
    "skills/ui-web/SKILL.md",
    "skills/ui-web/references/component-map.md",
    "skills/ui-web/references/composition-recipes.md",
    "skills/ui-web/references/integration.md",
    "skills/ui-web/references/styling-and-themes.md",
    "skills/ui-web/references/common-mistakes.md",
  ];
  for (const requiredFile of requiredFiles) {
    if (!lstatSync(resolve(packedRoot, requiredFile)).isFile()) {
      throw new Error(`Packed artifact is missing ${requiredFile}`);
    }
  }

  if (!packedManifest.exports["./uno"] || packedManifest.exports["uno"]) {
    throw new Error("UnoCSS must be exposed through the ./uno subpath");
  }
  if (
    !packedManifest.sideEffects?.includes("./dist/index.css") ||
    !packedManifest.sideEffects?.includes("./styles/**/*.scss")
  ) {
    throw new Error("Published CSS and Sass side effects are not declared");
  }

  const packedFiles = readdirSync(packedRoot, {
    recursive: true,
    withFileTypes: true,
  });
  if (
    packedFiles.some(
      (entry) =>
        entry.isFile() && (entry.name.endsWith(".vue") || entry.parentPath.includes("/src/")),
    )
  ) {
    throw new Error("Packed artifact exposes unintended runtime source files");
  }
  assertNoDeclarationLeaks(packedRoot, packedManifest);
  assertSkillTree(packedRoot);

  const consumerRoot = resolve(temporaryRoot, "consumer");
  const consumerModules = resolve(consumerRoot, "node_modules");
  const runtimeModules = resolve(extractionRoot, "node_modules");
  mkdirSync(consumerModules, { recursive: true });
  mkdirSync(runtimeModules, { recursive: true });
  const packageLink = resolve(consumerModules, targetPackageName);
  ensureParent(packageLink);
  symlinkSync(packedRoot, packageLink, "junction");

  const installedDependencies = new Set([
    ...Object.keys(packedManifest.dependencies ?? {}),
    ...Object.keys(packedManifest.peerDependencies ?? {}),
  ]);
  for (const dependency of installedDependencies) {
    linkDependency(dependency, consumerModules);
    linkDependency(dependency, runtimeModules);
  }

  writeFileSync(
    resolve(consumerRoot, "package.json"),
    JSON.stringify({
      private: true,
      type: "module",
      intent: {
        skills: [targetPackageName],
      },
    }),
    "utf8",
  );

  const intentCli = resolve(packageRoot, "node_modules/@tanstack/intent/dist/cli.mjs");
  const intentList = JSON.parse(
    run(process.execPath, [intentCli, "list", "--json"], {
      cwd: consumerRoot,
      capture: true,
    }),
  ) as {
    skills: Array<{ use: string; packageName: string; skillName: string }>;
  };
  const expectedSkill = `${targetPackageName}#ui-web`;
  if (
    intentList.skills.length !== 1 ||
    intentList.skills[0]?.use !== expectedSkill ||
    intentList.skills[0]?.packageName !== targetPackageName ||
    intentList.skills[0]?.skillName !== "ui-web"
  ) {
    throw new Error(
      `Intent did not discover exactly ${expectedSkill}: ${JSON.stringify(intentList.skills)}`,
    );
  }

  const loadedSkillPath = run(process.execPath, [intentCli, "load", expectedSkill, "--path"], {
    cwd: consumerRoot,
    capture: true,
  }).trim();
  const resolvedSkillPath = realpathSync(resolve(consumerRoot, loadedSkillPath));
  const resolvedPackedRoot = realpathSync(packedRoot);
  const relativeSkillPath = relative(resolvedPackedRoot, resolvedSkillPath);
  const expectedSkillPath = resolve(resolvedPackedRoot, "skills/ui-web/SKILL.md");
  if (relativeSkillPath.startsWith("..") || resolve(resolvedSkillPath) !== expectedSkillPath) {
    throw new Error(
      `Intent loaded a skill outside the packed artifact: ${JSON.stringify({
        loadedSkillPath,
        resolvedSkillPath,
        expectedSkillPath,
      })}`,
    );
  }

  const componentName = publicComponents.find(
    (component) => component.source === "inkButton",
  )?.name;
  if (!componentName) {
    throw new Error("Public InkButton component is missing");
  }
  run(
    process.execPath,
    [
      "--input-type=module",
      "--eval",
      `
const root = await import(${JSON.stringify(targetPackageName)});
const utilities = await import(${JSON.stringify(`${targetPackageName}/utils`)});
const localeModule = await import(${JSON.stringify(`${targetPackageName}/locales`)});
const unoModule = await import(${JSON.stringify(`${targetPackageName}/uno`)});
if (!root.default?.install || !root[${JSON.stringify(componentName)}] || !root.version) {
  throw new Error("Root entry is incomplete");
}
if (typeof utilities.useOptionalVModel !== "function") {
  throw new Error("Utilities entry is incomplete");
}
if (!localeModule.locales?.en || !unoModule.presetInk) {
  throw new Error("Locales or UnoCSS entry is incomplete");
}
try {
  await import(${JSON.stringify(`${targetPackageName}/components/inkButton/inkButton.vue`)});
  throw new Error("Raw component subpath unexpectedly resolved");
} catch (error) {
  if (error?.message === "Raw component subpath unexpectedly resolved") throw error;
  if (error?.code !== "ERR_PACKAGE_PATH_NOT_EXPORTED") throw error;
}
`,
    ],
    { cwd: consumerRoot },
  );

  const sassResult = sass.compileString(
    `
@use "pkg:${targetPackageName}/styles";
@use "pkg:${targetPackageName}/styles/functions" as functions;
@use "pkg:${targetPackageName}/styles/mixins" as mixins;
@use "pkg:${targetPackageName}/tokens/ref" as ref;
@use "pkg:${targetPackageName}/tokens/sys" as sys;
@use "pkg:${targetPackageName}/tokens/comp" as comp;

.contract-probe {
  color: functions.ref-var("color", "neutral", "2");
  @include mixins.apply-font("sm");
}
`,
    { importers: [new sass.NodePackageImporter(consumerRoot)] },
  );
  if (
    !sassResult.css.includes(".contract-probe") ||
    !sassResult.css.includes("--ref-color-neutral-2")
  ) {
    throw new Error("Sass contract probe did not emit expected output");
  }

  writeFileSync(
    resolve(consumerRoot, "App.vue"),
    `<template><${componentName} /></template>\n`,
    "utf8",
  );
  writeFileSync(
    resolve(consumerRoot, "index.ts"),
    `
import type { LocaleMessages } from ${JSON.stringify(`${targetPackageName}/locales`)};
import type { XOR } from ${JSON.stringify(`${targetPackageName}/utils`)};
import { presetInk } from ${JSON.stringify(`${targetPackageName}/uno`)};
import { version } from ${JSON.stringify(targetPackageName)};
const locale: LocaleMessages | null = null;
const xor: XOR<{ left: string }, { right: string }> = { left: version };
void locale;
void xor;
void presetInk;
`,
    "utf8",
  );
  writeFileSync(
    resolve(consumerRoot, "env.d.ts"),
    `/// <reference types=${JSON.stringify(targetPackageName)} />\n`,
    "utf8",
  );
  writeFileSync(
    resolve(consumerRoot, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        strict: true,
        target: "ES2022",
        module: "ESNext",
        moduleResolution: "Bundler",
        skipLibCheck: true,
        types: [targetPackageName],
      },
      include: ["*.ts", "*.vue"],
    }),
    "utf8",
  );
  run(
    "pnpm",
    [
      "--dir",
      packageRoot,
      "exec",
      "vue-tsc",
      "--noEmit",
      "-p",
      resolve(consumerRoot, "tsconfig.json"),
    ],
    { cwd: consumerRoot },
  );

  process.stdout.write(
    `Packed contract passed for ${targetPackageName}@${packageManifest.version}.\n`,
  );
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}
