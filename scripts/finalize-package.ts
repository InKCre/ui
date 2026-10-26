import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { repositoryRoot, resolveWebPackageRoot } from "./lib/ui-package.js";
import { verifyLogoInputs, verifyLogoPack } from "./lib/logo-pack.js";

const packageRoot = resolveWebPackageRoot();
const declarationPath = resolve(packageRoot, "dist/index.d.ts");
const globalTypesPath = resolve(packageRoot, "dist/components.d.ts");
const reference = '/// <reference path="./components.d.ts" />\n';

copyFileSync(resolve(packageRoot, "src/components.d.ts"), globalTypesPath);

const declaration = readFileSync(declarationPath, "utf8");
if (!declaration.startsWith(reference)) {
  writeFileSync(declarationPath, `${reference}${declaration}`, "utf8");
}

const logoSource = resolve(repositoryRoot, "assets/logo");
verifyLogoInputs(logoSource);
const { files } = verifyLogoPack(logoSource);
const assetsTarget = resolve(packageRoot, "assets");
rmSync(assetsTarget, { recursive: true, force: true });
mkdirSync(assetsTarget, { recursive: true });
for (const file of files) {
  const destination = resolve(assetsTarget, "logo", file);
  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(resolve(logoSource, file), destination);
}

process.stdout.write("Finalized package declarations, global components, and logo assets.\n");
