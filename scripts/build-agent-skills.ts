import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  readComponentManifest,
  readPackageManifest,
  resolveWebPackageRoot,
  type PublicComponent,
} from "./lib/ui-package.js";

// ============================================================================
// Constants
// ============================================================================

const PACKAGE_ROOT = resolveWebPackageRoot();
const COMPONENTS_DIR = resolve(PACKAGE_ROOT, "src/components");
const STORIES_DIR = resolve(PACKAGE_ROOT, "stories");
const SKILLS_OUTPUT_DIR = resolve(PACKAGE_ROOT, "agent-skills");
const PACKAGE_NAME = readPackageManifest(PACKAGE_ROOT).name;

// ============================================================================
// Types
// ============================================================================

interface ComponentInfo {
  name: string;
  source: string;
  props?: string;
  emits?: string;
  types?: string;
  documentation?: string;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Read a file safely, return null if not found
 */
function readFileSafe(filePath: string): string | null {
  try {
    return readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

/**
 * Extract component information from .ts file
 */
function extractComponentInfo(tsContent: string): {
  props?: string;
  emits?: string;
  types?: string;
} {
  const result: { props?: string; emits?: string; types?: string } = {};

  // Extract props definition
  const propsMatch = tsContent.match(/export const \w+Props = \{[\s\S]*?\} as const;/);
  if (propsMatch) {
    result.props = propsMatch[0].trim();
  }

  // Extract emits definition
  const emitsMatch = tsContent.match(/export const \w+Emits = \{[\s\S]*?\} as const;/);
  if (emitsMatch) {
    result.emits = emitsMatch[0].trim();
  }

  // Extract type definitions
  const typeMatches = tsContent.match(/(?:type|interface) \w+[^;{]*[;{][^}]*}?/g);
  if (typeMatches) {
    result.types = typeMatches.join("\n");
  }

  return result;
}

/**
 * Collect information about a single component
 */
function collectComponentInfo(component: PublicComponent): ComponentInfo {
  const componentPath = join(COMPONENTS_DIR, component.source);
  const info: ComponentInfo = {
    name: component.name,
    source: component.source,
  };

  // Read .ts file for props and types
  const tsFile = join(componentPath, `${component.source}.ts`);
  const tsContent = readFileSafe(tsFile);
  if (tsContent) {
    const extracted = extractComponentInfo(tsContent);
    info.props = extracted.props;
    info.emits = extracted.emits;
    info.types = extracted.types;
  }

  // Read .story.md file for documentation
  const storyMdFile = join(STORIES_DIR, component.category, `${component.source}.story.md`);
  const storyMdContent = readFileSafe(storyMdFile);
  if (storyMdContent) {
    // Clean Histoire-specific syntax
    info.documentation = storyMdContent
      .replace(/import .* from ['"]@histoire\/plugin-vue['"]/g, "")
      .replace(/import .* from ['"]\.\/.*\.vue['"]/g, "")
      .replace(/<Story[^>]*>/g, "")
      .replace(/<\/Story>/g, "")
      .replace(/<Variant[^>]*>/g, "")
      .replace(/<\/Variant>/g, "")
      .trim();
  }

  return info;
}

/**
 * Ensure directory exists
 */
function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

// ============================================================================
// Skill Generators
// ============================================================================

/**
 * Generate main components skill SKILL.md with references
 */
function generateComponentsSkillIndex(components: ComponentInfo[]): string {
  return `---
name: components
description: Use ${PACKAGE_NAME} Vue 3 components. Includes all ${components.length} components with props, events, and usage examples.
---

# ${PACKAGE_NAME} Components

Use this skill when working with the ${PACKAGE_NAME} Vue 3 component library.

## Overview

${PACKAGE_NAME} provides ${components.length} UI components for Vue 3 applications:
${components.map((component) => `- [${component.name}](references/${component.source}.md)`).join("\n")}

## Installation

\`\`\`bash
npm install ${PACKAGE_NAME}
# or
pnpm add ${PACKAGE_NAME}
\`\`\`

## Setup

\`\`\`typescript
// main.ts
import { createApp } from 'vue'
import InKCreUIWeb from '${PACKAGE_NAME}'
import "${PACKAGE_NAME}/styles"

const app = createApp(App)
app.use(InKCreUIWeb)
\`\`\`

## Component References

Each component has detailed documentation in the \`references/\` directory:

${components.map((component) => `- [\`${component.name}\`](references/${component.source}.md) - Component with props, events, and examples`).join("\n")}
`;
}

/**
 * Generate individual component reference file
 */
function generateComponentReference(component: ComponentInfo): string {
  let content = `# ${component.name}\n\n`;

  if (component.documentation) {
    content += `${component.documentation}\n\n`;
  }

  if (component.props) {
    content += `## Props\n\n\`\`\`typescript\n${component.props}\n\`\`\`\n\n`;
  }

  if (component.emits) {
    content += `## Events\n\n\`\`\`typescript\n${component.emits}\n\`\`\`\n\n`;
  }

  if (component.types) {
    content += `## Types\n\n\`\`\`typescript\n${component.types}\n\`\`\`\n\n`;
  }

  content += `## Import\n\n\`\`\`typescript\nimport { ${component.name} } from '${PACKAGE_NAME}';\n\`\`\`\n`;

  return content;
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  const startTime = Date.now();
  process.stdout.write("📚 Building Agent Skills...\n\n");

  try {
    const publicComponents = readComponentManifest(PACKAGE_ROOT);
    process.stdout.write(`Found ${publicComponents.length} components\n`);

    const components: ComponentInfo[] = [];
    for (const component of publicComponents) {
      process.stdout.write(`  Processing ${component.source}...\n`);
      const info = collectComponentInfo(component);
      components.push(info);
    }

    // Sort components alphabetically
    components.sort((a, b) => a.name.localeCompare(b.name));

    // Ensure skills directory exists
    const componentsSkillDir = join(SKILLS_OUTPUT_DIR, "components");
    ensureDir(componentsSkillDir);

    // Create references directory
    const referencesDir = join(componentsSkillDir, "references");
    rmSync(referencesDir, { recursive: true, force: true });
    ensureDir(referencesDir);

    // Generate main SKILL.md
    const skillIndex = generateComponentsSkillIndex(components);
    const skillFile = join(componentsSkillDir, "SKILL.md");
    writeFileSync(skillFile, skillIndex, "utf-8");
    process.stdout.write(`  ✓ Created components/SKILL.md\n`);

    // Generate individual component reference files
    for (const component of components) {
      const referenceContent = generateComponentReference(component);
      const referenceFile = join(referencesDir, `${component.source}.md`);
      writeFileSync(referenceFile, referenceContent, "utf-8");
      process.stdout.write(`  ✓ Created components/references/${component.source}.md\n`);
    }

    const elapsed = Date.now() - startTime;
    process.stdout.write("\n✅ Agent Skills built successfully!\n");
    process.stdout.write(`📁 Output directory: ${SKILLS_OUTPUT_DIR}/\n`);
    process.stdout.write(
      `📊 Created components skill with ${components.length} component references\n`,
    );
    process.stdout.write(`⏱️  Completed in ${elapsed}ms\n`);
  } catch (error) {
    process.stderr.write("\n❌ Error building Agent Skills:\n");
    process.stderr.write(String(error) + "\n");
    if (error instanceof Error && error.stack) {
      process.stderr.write(error.stack + "\n");
    }
    process.exit(1);
  }
}

main();
