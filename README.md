# InKCre UI

The InKCre design system and the `@inkcre/ui-web` web renderer — design tokens, Vue components, and an interactive component catalog.

`ui` 是 InKCre 的设计系统仓库——维护品牌资产、Token 源、Vue 组件和交互式组件目录，并通过独立 Logo Pack 与 `@inkcre/ui-web` 交付给消费方。

## Repository shape

- [`DESIGN.md`](DESIGN.md) — design principles and the per-task reading path
- `docs/design/` — design stance, visual language, page composition, and rationale
- `tokens/inkcre.tokens.json` — the Token specification source (Figma proposes value updates; the generator owns outputs)
- `packages/web/` — the `@inkcre/ui-web` Vue component package
- [`assets/logo/`](assets/logo/README.zh-CN.md) — 跨平台 Logo 资产、来源、清单和重建脚本
- `scripts/build-tokens.ts` — the Token generator (Style Dictionary)

## Quickstart

### 获取 Logo

[下载完整 Logo Pack（2026-10-21）](assets/InKCre-logo-pack-20261021.zip)，解压即可用于原生应用、网站和设计工具，无需安装 Vue。包内有 264 个 SVG／PNG 资产，覆盖浅色、深色、单色及高 DPI 用法；选择方式见 [Logo 说明](assets/logo/README.zh-CN.md)。Web 包同时通过 `@inkcre/ui-web/logo/*` 提供同一批文件，示例见[包说明](packages/web/README.md#logo-资产)。需要固定资产版本时，使用具体 Git 提交或安装包版本，避免跟随移动分支。

### Use the package

```bash
pnpm add @inkcre/ui-web
```

See [`packages/web/README.md`](packages/web/README.md) for installation, public entries, and the Skills shipped with the package. Browse the live component catalog at [design.inkcre.dev](https://design.inkcre.dev).

### Develop locally

```bash
git submodule update --init --recursive docs/_shared
pnpm install --frozen-lockfile
pnpm generate
pnpm story:dev
```

`pnpm check` is the required local/CI baseline. Setup, Token pipeline, Histoire delivery, joint development with `impl-ts`, and GitHub Packages authentication all live in [CONTRIBUTING.md](CONTRIBUTING.md).

## Documentation

- [Design principles and reading path](DESIGN.md)
- [Documentation index](docs/index.md)
- [Repository conventions](AGENTS.md) · [Web package conventions](packages/web/AGENTS.md)
- [Package usage](packages/web/README.md)
- Shared product truth Hub: [`InKCre/docs`](https://github.com/InKCre/docs) (mounted read-only at `docs/_shared/`)
