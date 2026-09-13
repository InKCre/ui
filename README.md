# InKCre UI

The InKCre design system and multi-platform UI workspace. The current web
renderer is published as `@inkcre/ui-web`.

## Single Source of Truth

设计判断由 [DESIGN.md](DESIGN.md) 维护。`tokens/inkcre.tokens.json` 是 Token 规范源，
Figma 仅提议已有路径的值更新；生成物通过生成器更新。
当前输入格式与维护入口见 [Token 指南](tokens/tokens.md)，生成命令与输出见
[Token 生成说明](scripts/build-tokens.md)。

`scripts/build-tokens.ts` transforms the token source into:

- `packages/web/styles/tokens/_ref.scss`
- `packages/web/styles/tokens/_sys.scss`
- `packages/web/styles/tokens/_comp.scss`
- `packages/web/styles/uno/preset-ink.ts`

The generator uses
[Style Dictionary](https://www.npmjs.com/package/style-dictionary).

## Toolchain

The root manifest delegates both tools to pnpm:

- pnpm `11.17.0`
- Node.js runtime `22.22.3`

The root `packageManager` selects pnpm. Its `devEngines.runtime` entry makes
pnpm resolve the exact Node.js runtime into the lockfile and use it for project
scripts. Run project commands through pnpm rather than a separately managed
Node installation.

Install once at the repository root:

```bash
pnpm install --frozen-lockfile
```

Do not install from an individual package directory. The root
`pnpm-lock.yaml` is the only dependency lock.
Dependency lifecycle scripts are denied by default; the small reviewed
allowlist lives in `pnpm-workspace.yaml`.

## Shared product docs

Shared InKCre product truth and cross-unit contracts are mounted read-only at
`docs/_shared` from `InKCre/docs`. Initialize the pinned reference after cloning:

```bash
git submodule update --init --recursive docs/_shared
```

Do not edit the mounted files from this repository. The repo-root
`.agents/skills/edit-svc-shared-docs` wrapper points coding Agents to the
canonical Hub-first edit and isolated ref-bump workflow.

## Development commands

```bash
pnpm dev          # Run the web package development server
pnpm story:dev    # Run the interactive component catalog
pnpm type-check   # Check root scripts and Vue source
pnpm generate     # Rebuild tokens, package metadata, and Agent Skills
pnpm build        # Build the publishable package
pnpm story        # Build the component catalog
pnpm check        # Run the complete local/CI baseline
```

Generate derived files with `pnpm generate`. The public component manifest
drives the runtime registry, global component types, package version, Story
coverage, and generated Agent Skills.

本仓库目前没有自动化单元／组件测试套件，也没有 `pnpm test` 命令。
日常修改运行相关检查；完整本地／CI 基线使用 `pnpm check`。涉及交互或视觉行为时，
还需核对受影响的 Story 或真实消费页面；构建和覆盖检查不证明这些行为正确。
检查选择遵循 [组织验证政策](https://github.com/InKCre/.github/blob/main/TESTING.md)。

## 文档入口

- [设计决策指南](DESIGN.md)：消费者与维护者共享的默认选择、变化条件和扩展边界。
- [文档导航](docs/index.md)：维护与消费文档的入口。
- [仓库约定](AGENTS.md)与[Web 包约定](packages/web/AGENTS.md)：代码和生成物的维护责任。
- [包使用说明](packages/web/README.md)：安装、公开入口和随包 Skill。
- [UI 基础能力工作包](tasks/ui-foundations/packet.md)：当前任务的分组、状态和验证证据。

## Histoire delivery

`UI checks` validates Histoire as part of the repository contract. After a
successful same-repository run, the trusted Preview workflow checks out that
exact pull-request head, builds Histoire itself, and publishes it to the stable
`pr-N.design-dd4.pages.dev` preview alias. Closing the pull request replaces the
alias with a noindex marker; Cloudflare retains older immutable deployment URLs
as platform history.

A protected `main` push builds Histoire again as a focused release, transfers
the exact same-run artifact to the deployment job, and publishes it to
[design.inkcre.dev](https://design.inkcre.dev). Package publication and Histoire
delivery are independent outputs of `main`: one may be retried without
republishing the other. `wrangler.toml` owns the Pages project name, output
directory, and compatibility date. Delivery jobs run through GitHub environments;
the Cloudflare credential remains a selected organization Actions secret.

## Joint development with client-web

The consuming Vite/Vitest/TypeScript pipeline owns source consumption. Keep
this workspace installed and generated, then opt in from a sibling
`client-web` checkout:

```bash
pnpm install --frozen-lockfile
pnpm generate
pnpm --dir ../client-web dev:ui --ui-source ../ui/packages/web
```

Replace `../ui` with this checkout's actual location while the local directory
is still named `design` or is stored elsewhere.

The command validates this package root and maps only its public specifiers for
the current development process. It does not use `pnpm link`, persist an
absolute path, or modify either manifest or lockfile. Token JSON changes still
require `pnpm generate`.

Run the consumer source-graph check with
`pnpm --dir ../client-web type-check:ui --ui-source ../ui/packages/web`.
Normal client development, builds, checks, and CI remain pinned to the
published registry artifact. The consumer's
[`docs/40-deployment/development-runtime.md`](https://github.com/InKCre/client-web/blob/main/docs/40-deployment/development-runtime.md#joint-development-lanes)
owns the full startup, remotes, cleanup, troubleshooting, and release-fidelity
contract.

## GitHub Packages authentication

The committed `.npmrc` routes only the `@inkcre` scope to GitHub Packages. It
never stores or expands a credential. Local credentials belong to the trusted
user configuration.

For interactive one-time setup, create a classic GitHub personal access token
with `read:packages`, then let npm write it to your user-level configuration:

```bash
npm login --scope=@inkcre --auth-type=legacy --registry=https://npm.pkg.github.com
```

Use your GitHub username, the token as the password, and your public email when
prompted. Alternatively, a credential manager may inject `NODE_AUTH_TOKEN`
into the current process if your user-level `~/.npmrc` contains:

```ini
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Do not add that credential line to the repository `.npmrc`. Verify access with
the package manager itself:

```bash
pnpm view @inkcre/ui-web version
pnpm install --frozen-lockfile
```

Treat `401` or `403` as an expired token, missing `read:packages`, or missing
package access. A `404` can also mean that the package name or repository
access is wrong. Re-run the native login flow after correcting the underlying
GitHub permission; this repository intentionally has no separate auth doctor.
