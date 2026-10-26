# InKCre UI

The InKCre design system and the `@inkcre/ui-web` web renderer — design tokens, Vue components, and an interactive component catalog.

`ui` 是 InKCre 的设计系统仓库——维护品牌资产、Token 源、Vue 组件和交互式组件目录，通过 `@inkcre/ui-web`、SwiftPM 与 GitHub Release 的 Logo ZIP 交付给消费方。

## Repository shape

- [`DESIGN.md`](DESIGN.md) — design principles and the per-task reading path
- `docs/design/` — design stance, visual language, page composition, and rationale
- `tokens/inkcre.tokens.json` — the Token specification source (Figma proposes value updates; the generator owns outputs)
- `packages/web/` — the `@inkcre/ui-web` Vue component package
- [`assets/logo/`](assets/logo/README.zh-CN.md) — 跨平台 Logo 资产、来源、清单和重建脚本
- `scripts/build-tokens.ts` — the Token generator (Style Dictionary)

## Quickstart

### 获取 Logo

Web 消费者从 `@inkcre/ui-web/logo/*` 导入，Swift 消费者依赖本仓库的 `InKCreLogoAssets` product；用法见 [Logo 说明](assets/logo/README.zh-CN.md)。正式发行的 ZIP 位于[对应 GitHub Release](https://github.com/InKCre/ui/releases)，供人工和设计工具使用。SVG 为源，PNG 与 ZIP 为产物；App Icon 的画布、尺寸和平台绑定由消费者制作和维护。原日期 ZIP 仅保留为历史输入。

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
