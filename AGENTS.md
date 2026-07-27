# `@inkcre/ui` coding guide

This repository owns the InKCre design system and UI libraries.

## Project Structure

- `packages/`: this is a monorepo
  - `web`: `@inkcre/ui-web`, the InKCre UI library for web projects
- `tokens/`
  - `inkcre.tokens.json`: Design tokens follows W3C DTCG format
- `scripts/`
  - `build-tokens.ts`: Transform design tokens to code

## Coding Guidelines

- [Coding for Human](/.github/instructions/coding-for-human.instructions.md)

## Development Workflows

- Package manager is PNPM
- Use changeset to summarize your changes (run `pnpm changeset` after you made changes.)
- Run tests and build to verify your changes if possible.
