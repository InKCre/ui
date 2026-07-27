import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { readComponentManifest, resolveWebPackageRoot } from "./lib/ui-package.js";

const packageRoot = resolveWebPackageRoot();
const storiesRoot = resolve(packageRoot, "stories");
const components = readComponentManifest(packageRoot);
const expectedStories = new Map(
  components.map((component) => [
    resolve(storiesRoot, component.category, `${component.source}.story.vue`),
    component,
  ]),
);
const expectedDocumentation = new Set(
  components.map((component) =>
    resolve(storiesRoot, component.category, `${component.source}.story.md`),
  ),
);

const actualStories = readdirSync(storiesRoot, {
  recursive: true,
  withFileTypes: true,
})
  .filter((entry) => entry.isFile() && entry.name.endsWith(".story.vue"))
  .map((entry) => resolve(entry.parentPath, entry.name));
const actualDocumentation = readdirSync(storiesRoot, {
  recursive: true,
  withFileTypes: true,
})
  .filter((entry) => entry.isFile() && entry.name.endsWith(".story.md"))
  .map((entry) => resolve(entry.parentPath, entry.name));

const errors: string[] = [];

for (const [storyPath, component] of expectedStories) {
  if (!existsSync(storyPath)) {
    errors.push(`Missing story for ${component.name}: ${storyPath}`);
    continue;
  }

  const story = readFileSync(storyPath, "utf8");
  const expectedCategory = component.category[0].toUpperCase() + component.category.slice(1);
  if (!story.includes(`title="${expectedCategory}/`)) {
    errors.push(`${component.name} story must use the ${expectedCategory} category`);
  }
  if (!/<Variant\b/.test(story)) {
    errors.push(`${component.name} story has no variants`);
  }
}

for (const documentationPath of expectedDocumentation) {
  if (!existsSync(documentationPath)) {
    errors.push(`Missing story documentation: ${documentationPath}`);
  }
}

for (const storyPath of actualStories) {
  if (!expectedStories.has(storyPath)) {
    errors.push(`Story is not declared by component-manifest.json: ${storyPath}`);
  }
}

for (const documentationPath of actualDocumentation) {
  if (!expectedDocumentation.has(documentationPath)) {
    errors.push(
      `Story documentation is not declared by component-manifest.json: ${documentationPath}`,
    );
  }
}

if (errors.length > 0) {
  process.stderr.write(`${errors.join("\n")}\n`);
  process.exit(1);
}

process.stdout.write(`Story coverage is complete for ${components.length} public components.\n`);
