# Execution 03 — Package And Generator Contract

Execution 03 was completed locally on 2026-07-27 as part of Sir's authorization to carry the engineering roadmap through Execution 05. This slice repairs the published artifact before introducing the new package identity; it does not mutate `../client-web`.

## Delivered

- Replaced the invalid mixed `exports` map with explicit JavaScript, declaration, CSS, Sass, token, locale, utility, and UnoCSS subpaths.
- Built every claimed JavaScript subpath and its declarations. Raw component-directory imports remain private and are rejected by the package boundary.
- Externalized package peers consistently, including the JSON editor's direct `vscode-languageserver-textdocument` dependency.
- Established one public-component manifest for generated component metadata, Vue global component types, package version data, Agent Skills, and story coverage.
- Anchored token and Agent Skill generation to the repository root instead of the caller's working directory.
- Added stale-generation gates for package metadata, tokens, and Agent Skills.
- Added a packed consumer contract that creates a tarball, installs it in an isolated fixture, and probes Node, Vue/TypeScript, CSS, Sass, tokens, locales, utilities, UnoCSS, side effects, and forbidden raw subpaths.
- Added a changeset policy gate for package behavior, contents, public documentation, and generated token changes.
- Reworked token-update preparation into a deterministic payload-to-source-to-generated-output-to-changeset pipeline. The GitHub workflow validates input, uses collision-resistant branch and changeset names, and is covered by a local fixture.

## Verification

| Gate | Result |
|---|---|
| packed `@inkcre/web-design@1.2.2` contract | pass |
| Node and Vue/TypeScript consumer probes | pass |
| CSS, Sass, token, locale, utility, and UnoCSS probes | pass |
| raw component subpath rejection | pass |
| declaration leak scan | no `.pnpm`, relative `node_modules`, or private source leaks |
| generated-output second pass | clean |
| deterministic token workflow fixture | pass |

The main JavaScript artifact shrank from approximately 4.6 MB to 258 KB after peer externalization. API Extractor still reports that its bundled TypeScript 5.8 compiler is older than the workspace TypeScript 5.9 compiler; this is an upstream compatibility warning, not a suppressed package diagnostic.

## Boundary

The repaired artifact can be reproducibly repacked and exercised under the old package identity. This preserves the pre-rename identity proof; it does not claim that the immutable historical registry tarball was rewritten or repaired. Consumer alias removal and frozen installation of the new package belong to Execution 06, after the new exact registry version exists.
