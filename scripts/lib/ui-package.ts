import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export interface PublicComponent {
  name: string;
  source: string;
  category: "controls" | "feedback" | "forms" | "media" | "overlays" | "specialized";
}

interface ComponentManifest {
  components: PublicComponent[];
}

interface PackageManifest {
  name: string;
  version: string;
}

export const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

export function resolveWebPackageRoot(root = repositoryRoot): string {
  const packageRoot = resolve(root, "packages/web");

  if (!existsSync(resolve(packageRoot, "package.json"))) {
    throw new Error(`Cannot find the web package below ${root}`);
  }

  return packageRoot;
}

export function readPackageManifest(packageRoot = resolveWebPackageRoot()): PackageManifest {
  return JSON.parse(readFileSync(resolve(packageRoot, "package.json"), "utf8")) as PackageManifest;
}

export function readComponentManifest(packageRoot = resolveWebPackageRoot()): PublicComponent[] {
  const manifest = JSON.parse(
    readFileSync(resolve(packageRoot, "component-manifest.json"), "utf8"),
  ) as ComponentManifest;
  const names = new Set<string>();
  const sources = new Set<string>();

  for (const component of manifest.components) {
    if (!/^Ink[A-Z][A-Za-z0-9]+$/.test(component.name)) {
      throw new Error(`Invalid public component name: ${component.name}`);
    }
    if (!/^ink[A-Z][A-Za-z0-9]+$/.test(component.source)) {
      throw new Error(`Invalid component source name: ${component.source}`);
    }
    if (names.has(component.name) || sources.has(component.source)) {
      throw new Error(`Duplicate public component: ${component.name}`);
    }
    names.add(component.name);
    sources.add(component.source);

    const componentRoot = resolve(packageRoot, "src/components", component.source);
    for (const extension of ["vue", "ts"]) {
      const sourceFile = resolve(componentRoot, `${component.source}.${extension}`);
      if (!existsSync(sourceFile)) {
        throw new Error(`Missing public component source: ${sourceFile}`);
      }
    }
  }

  return [...manifest.components].sort((left, right) => left.name.localeCompare(right.name));
}
