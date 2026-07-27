# build-agent-skills.ts

Generates Agent Skills for the `@inkcre/ui-web` package following the [agentskills.io](https://agentskills.io) specification.

## Overview

This script creates properly formatted Agent Skills for component documentation. Skills are organized folders containing `SKILL.md` files with YAML frontmatter and markdown content.

## What are Agent Skills?

Agent Skills are a standardized format for packaging domain-specific expertise that AI agents can discover and load dynamically. Each skill contains:

- **YAML frontmatter**: Metadata including `name` and `description`
- **Markdown content**: Instructions, examples, and reference material
- **Optional directories**: Scripts, references, and assets

Learn more at [agentskills.io](https://agentskills.io/specification).

## Generated Skills

The script automatically generates the **components** skill in `agent-skills/components/`:

### components

Main skill for using the component library with individual component reference files:

- Main `SKILL.md` with overview and setup
- `references/` directory with one markdown file per component
- Each component file includes props, events, types, and usage examples
- Components are loaded on-demand by referencing their individual files

## Manual Skills

The following skills are maintained manually in `agent-skills/`:

### router

Router integration patterns with Vue Router adapter setup.

### i18n

Internationalization setup with vue-i18n integration.

### styling

Design token system with SCSS utilities and theming examples.

### best-practices

Development guidelines including naming conventions and accessibility.

## Usage

From the repository root:

```bash
pnpm build-skills
```

From the web UI package:

```bash
cd packages/web
pnpm build:skills
```

## Output Structure

```
packages/web/agent-skills/
├── components/
│   ├── SKILL.md                    # Main components skill
│   └── references/                 # Individual component files
│       ├── inkButton.md
│       ├── inkInput.md
│       └── ...
├── router/
│   └── SKILL.md                    # Manual
├── i18n/
│   └── SKILL.md                    # Manual
├── styling/
│   └── SKILL.md                    # Manual
└── best-practices/
    └── SKILL.md                    # Manual
```

Each `SKILL.md` follows the agentskills.io specification:

```markdown
---
name: skill-name
description: What this skill does and when to use it
---

# Skill Content

Instructions and examples...
```

## Integration

Skills are:

- Generated during the build process (components only)
- Shipped with the npm package (via `agent-skills/` in `files` array)
- Automatically discovered by compatible AI agents
- Loaded on-demand when relevant to user's task

## Agent Compatibility

These skills work with:

- Claude Code (Anthropic)
- GitHub Copilot (VS Code, CLI)
- OpenAI Codex
- Cursor
- Any agent supporting the agentskills.io standard

## How Agents Use Skills

1. **Discovery**: Agent scans `agent-skills/` directory
2. **Metadata Loading**: Reads YAML frontmatter (name, description)
3. **Tool Registration**: Exposes skills as callable functions
4. **Activation**: User's query triggers relevant skill
5. **Content Loading**: Main SKILL.md and referenced files loaded on-demand
6. **Execution**: Agent follows skill instructions

## Progressive Disclosure

The components skill uses progressive disclosure:

- Main `SKILL.md` provides overview and component list
- Individual component files in `references/` are loaded only when needed
- This keeps context window small while providing access to all details

## Maintenance

The script automatically:

- Extracts component info from TypeScript files
- Cleans Histoire-specific syntax from documentation
- Generates valid YAML frontmatter
- Creates compliant directory structure
- Validates skill names (lowercase, hyphens only)

Manual skills should be updated directly in `agent-skills/` directory.
