# Contributing

The organization-wide Git and pull-request policy lives in
[InKCre Git and GitHub Governance](https://github.com/InKCre/.github/blob/main/GOVERNANCE.md).
This guide covers the `ui`-specific development, delivery, and joint-development workflows
required by that policy.

## Setup

```bash
git submodule update --init --recursive docs/_shared
pnpm install --frozen-lockfile
pnpm generate
```

Install once at the repository root. Do not install from individual package directories;
the root `pnpm-lock.yaml` is the only dependency lock. Dependency lifecycle scripts are
denied by default; the reviewed allowlist lives in `pnpm-workspace.yaml`.

Run all project commands through pnpm. The root `packageManager` field selects pnpm, and
`devEngines.runtime` resolves the exact Node.js runtime into the lockfile.

## Daily commands

```bash
pnpm dev          # Run the web package development server
pnpm story:dev    # Run the interactive component catalog
pnpm type-check   # Check root scripts and Vue source
pnpm generate     # Rebuild tokens, package metadata, and Agent Skills
pnpm build        # Build the publishable package
pnpm story        # Build the component catalog
pnpm check        # Run the complete local/CI baseline
```

`pnpm generate` produces derived files from the public component manifest: the runtime
registry, global component types, package version, Story coverage, and generated Agent
Skills. Token JSON changes always require `pnpm generate` before consumption.

## Testing

This repository has no automated unit/component test suite and no `pnpm test` command.
Run targeted checks for daily changes; use `pnpm check` as the complete local/CI baseline.
For interaction or visual behavior changes, also review the affected Story or real
consuming page — build and coverage checks do not prove those behaviors correct.
Check selection follows the [organization verification policy](https://github.com/InKCre/.github/blob/main/TESTING.md).

## 包版本与迁移说明

需要消费者调整调用或特别复核的变化写入 `packages/web/MIGRATION.md` 的 `## 下一版本` 区，并为 Web 包添加 Changeset。正文中的小节使用三级标题；CHANGELOG 记录版本变化，MIGRATION 只说明升级动作和兼容边界，不重复完整变更列表。

运行 `pnpm changeset:version` 推进版本。它先恢复未完成的迁移归档，再执行 Changesets，将待定正文归入新的正式版本，最后同步包元数据。`migration-base` 标记记录待定内容开始积累时的包版本，由命令维护，不手改；版本发生变化但没有迁移内容时也会更新标记。版本标题表示该版本包含这些变化，不表示 registry 已发布成功。

归档通过一次文件替换同时更新正文与基准，已有历史不改写。Changesets 成功后若归档或元数据生成失败，修复报错后重跑同一命令；先完成恢复，再添加下一批 Changeset。Changesets 自身失败时可能留下部分版本文件，需要先检查其输出与工作树，不将部分结果直接发布。目标版本已存在迁移历史时，命令报错并保留原文，交由维护者核对。

`pnpm check:release` 校验迁移结构并在临时工作区验证版本推进、失败恢复与重复执行；普通 PR 可以保留待定内容。`pnpm changeset:publish` 在发布前要求基准与包版本一致、待定区为空，不能用裸 `changeset publish` 绕过检查。当前归档入口只支持正式版本；引入预发布流程时需同步定义迁移归属和恢复规则。

组件用途、交互和示例变化的文档责任见[Agent 文档生成说明](scripts/build-agent-skills.md#内容责任)。作者核对受影响的选型与限制，审阅者通过相关 Story 或实际消费者动作确认；结构、类型和构建检查只承担各自能观察到的事实。

## Logo 资产维护

`assets/logo/` 拥有跨平台 Logo 资产，配套的日期版 ZIP 是无需运行时依赖的下载件。当前批次按用户提供的 `InKCre-logo-pack-20261021.zip` 原样纳入，包括矢量、PNG、母版、原始来源、清单、历史 QA 和重建脚本。`PROVENANCE.json` 中的其他仓库路径只记录来源；今后的维护以 UI 仓库为准。

正常包构建只校验并复制到 `packages/web/assets/`，不重绘资产，也不要求安装 Inkscape 或 Pillow。后者仅用于显式重建，依赖及步骤见资产包说明。维护者更新源文件后，应复核浅深色与逻辑尺寸、重建清单，并交付匹配的新日期版 ZIP；已发布的日期版下载件不覆盖。同步更新下载链接、包说明及 Changeset。包内 `QA-report.json` 是该批次的历史报告，不能替代本次验证。

`check:package` 核对源目录、ZIP 与实际安装产物的文件集合和字节，并通过临时 Vite 消费者验证 SVG／PNG 子路径。此检查需要 `unzip`（macOS 和现有 Ubuntu CI 已提供）；不会运行资产重建脚本。

## Token pipeline

`tokens/inkcre.tokens.json` is the Token specification source. Figma proposes value
updates against existing paths; the generator owns generated outputs.
See [Token Guide](tokens/tokens.md) for the input format and maintenance entry, and
[Token Build Notes](scripts/build-tokens.md) for generation commands and outputs.

`scripts/build-tokens.ts` uses [Style Dictionary](https://www.npmjs.com/package/style-dictionary)
to produce:

- `packages/web/styles/tokens/_ref.scss`
- `packages/web/styles/tokens/_sys.scss`
- `packages/web/styles/tokens/_comp.scss`
- `packages/web/styles/uno/preset-ink.ts`

## Histoire delivery

The showcase build uses the lockfile-pinned Vue and Histoire highlight implementations,
bundled by Vite. Do not swap Vue for a CDN production build or stub Shiki with an empty
object; Histoire's state sync and source panel depend on these libraries' actual runtime
contracts.

`UI checks` validates Histoire as part of the repository contract. After a successful
same-repository run, the trusted Preview workflow checks out that exact pull-request head,
builds Histoire itself, and publishes to the stable `pr-N.design-dd4.pages.dev` preview
alias. Closing the pull request replaces the alias with a noindex marker; Cloudflare
retains older immutable deployment URLs as platform history.

A protected `main` push builds Histoire again as a focused release, transfers the exact
same-run artifact to the deployment job, and publishes it to
[design.inkcre.dev](https://design.inkcre.dev). Package publication and Histoire delivery
are independent outputs of `main`: one may be retried without republishing the other.
`wrangler.toml` owns the Pages project name, output directory, and compatibility date.
Delivery jobs run through GitHub environments; the Cloudflare credential remains a
selected organization Actions secret.

## Joint development with impl-ts

The consuming Vite/Vitest/TypeScript pipeline owns source consumption. Keep this
workspace installed and generated, then opt in from a sibling `impl-ts` checkout:

```bash
pnpm install --frozen-lockfile
pnpm generate
pnpm --dir ../impl-ts dev:ui --ui-source ../ui/packages/web
```

The command validates this package root and maps only its public specifiers for the
current development process. It does not use `pnpm link`, persist an absolute path, or
modify either manifest or lockfile. Token JSON changes still require `pnpm generate`.

Run the consumer source-graph check with
`pnpm --dir ../impl-ts type-check:ui --ui-source ../ui/packages/web`.
Normal client development, builds, checks, and CI remain pinned to the published
registry artifact. The consumer's
[`docs/40-deployment/development-runtime.md`](https://github.com/InKCre/impl-ts/blob/main/docs/40-deployment/development-runtime.md#joint-development-lanes)
owns the full startup, remotes, cleanup, troubleshooting, and release-fidelity contract.

## GitHub Packages authentication

The committed `.npmrc` routes only the `@inkcre` scope to GitHub Packages. It never
stores or expands a credential. Local credentials belong to the trusted user
configuration.

For interactive one-time setup, create a classic GitHub personal access token with
`read:packages`, then let npm write it to your user-level configuration:

```bash
npm login --scope=@inkcre --auth-type=legacy --registry=https://npm.pkg.github.com
```

Use your GitHub username, the token as the password, and your public email when
prompted. Alternatively, a credential manager may inject `NODE_AUTH_TOKEN` into the
current process if your user-level `~/.npmrc` contains:

```ini
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Do not add that credential line to the repository `.npmrc`. Verify access with the
package manager itself:

```bash
pnpm view @inkcre/ui-web version
pnpm install --frozen-lockfile
```

Treat `401` or `403` as an expired token, missing `read:packages`, or missing package
access. A `404` can also mean that the package name or repository access is wrong.
Re-run the native login flow after correcting the underlying GitHub permission; this
repository intentionally has no separate auth doctor.

## Shared product docs

Shared InKCre product truth and cross-unit contracts are mounted read-only at
`docs/_shared` from [`InKCre/docs`](https://github.com/InKCre/docs). Initialize the
pinned reference after cloning:

```bash
git submodule update --init --recursive docs/_shared
```

Do not edit the mounted files from this repository. The repo-root
`.agents/skills/edit-svc-shared-docs` wrapper points coding agents to the canonical
Hub-first edit and isolated ref-bump workflow.
