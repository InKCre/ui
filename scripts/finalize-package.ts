import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { resolveWebPackageRoot } from "./lib/ui-package.js";

const packageRoot = resolveWebPackageRoot();
const declarationPath = resolve(packageRoot, "dist/index.d.ts");
const globalTypesPath = resolve(packageRoot, "dist/components.d.ts");
const unoTypesPath = resolve(packageRoot, "dist/uno/preset-ink.d.ts");
const reference = '/// <reference path="./components.d.ts" />\n';

copyFileSync(resolve(packageRoot, "src/components.d.ts"), globalTypesPath);

const declaration = readFileSync(declarationPath, "utf8");
if (!declaration.startsWith(reference)) {
  writeFileSync(declarationPath, `${reference}${declaration}`, "utf8");
}

writeFileSync(
  unoTypesPath,
  `import type { PresetFactory } from "unocss";

export declare const presetInk: PresetFactory;
export default presetInk;
`,
  "utf8",
);

process.stdout.write("Finalized package declarations and global components.\n");
