# InKCre UI

The InKCre design system and the `@inkcre/ui-web` web renderer — design tokens, Vue components, and an interactive component catalog.

`ui` 是 InKCre 的设计系统仓库——维护 Token 源、Vue 组件和交互式组件目录，并通过 `@inkcre/ui-web` 发布给 Web 消费方。

## Repository shape

- [`DESIGN.md`](DESIGN.md) — design principles and the per-task reading path
- `docs/design/` — design stance, visual language, page composition, and rationale
- `tokens/inkcre.tokens.json` — the Token specification source (Figma proposes value updates; the generator owns outputs)
- `packages/web/` — the `@inkcre/ui-web` Vue component package
- `scripts/build-tokens.ts` — the Token generator (Style Dictionary)

## Quickstart

### Use the package

The current GitHub Packages path requires package read access and npm authentication. A public
Release-tarball path is being prepared; see the [delivery and cutover contract](CONTRIBUTING.md#public-package-delivery)
before selecting an installation path.

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
