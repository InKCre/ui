# InKCre UI

This repository owns the InKCre design system and UI libraries.

Reason in English. Communicate with humans in Chinese.

## Repository Map

- `packages/web/`: `@inkcre/ui-web`, its public components, styles, stories,
  generated consumer skill, and package-local instructions.
- `tokens/inkcre.tokens.json`: 仓库维护的设计 Token 规范源，使用 `type/value`；Figma 仅提议已有路径的值更新，格式与维护入口见 [Token 指南](tokens/tokens.md)。
- `scripts/`: deterministic token, package-metadata, Agent Skill, contract, and
  release preparation commands.
- `docs/index.md`: durable documentation navigation.
- `tasks/`: volatile task packets retained only while their parent task is active.

## Knowledge Owners

UI 设计、组件、Token 或视觉审视工作从 [DESIGN.md](DESIGN.md) 的总纲和阅读路径进入，只读取与任务有关的设计正文。`docs/design/` 分别维护设计立场、视觉语言、页面组合与判断依据；纯构建和非 UI 工作无需加载这些正文。具体值与 API 仍由下面的源头负责。

- Repository and package entry points: `README.md` and `packages/web/README.md`.
- Public package API: package exports, component manifest, TypeScript source,
  generated declarations, and styles.
- Component usage evidence: `packages/web/stories/`.
- UI consumer Agent guidance: `packages/web/skill.seed.json` and the generated
  `packages/web/skills/ui-web/` artifact.
- Package migration contract: `packages/web/MIGRATION.md`.
- Build, release, preview, and production behavior: package scripts, repository
  scripts, and `.github/workflows/`.
- Repeated subtree hazards: the nearest local `AGENTS.md`.

## 设计变更的维护责任

先明确变化要保持的设计关系，再确定修改位置。已有角色是否可复用，取决于共同用途与共同变化理由；新增共享能力应说明实际情境、现有缺口、默认行为、允许变化和覆盖责任。可以在变更说明中自然表达，无须另建统一模板。

设计正文拥有已确认的选择及其理由，Token 源拥有名称、类型、值与引用，组件源码和声明拥有 API 事实。实现观察、提炼过程、待确认方案与讨论状态记录在 task packet，确认后的结论才进入正式正文。当前表现与认可要求不一致时应明确指出差异，按任务授权修复或提出规则变更，不能只为解释代码而修改要求。

改变公开名称、用途、默认表现或交互承诺时，同步相应实现、设计正文、示例和迁移说明。静态检查确认交付事实，真实场景确认设计关系与表现；视觉验收需要说明比较依据，不能只报告 Token 合法或构建成功。

## Coding Guidelines

- [Coding for Human](.github/instructions/coding-for-human.instructions.md)

## Development Workflow

- Follow the organization-wide [Git and GitHub Governance](https://github.com/InKCre/.github/blob/main/GOVERNANCE.md)
  and [contribution workflow](https://github.com/InKCre/.github/blob/main/CONTRIBUTING.md) for branches, pull requests,
  release authority, and delivery boundaries; repository-local documents own exact commands.
- Never edit `docs/_shared/**` from this Spoke. Use
  `.agents/skills/edit-svc-shared-docs/` to change the Hub source first and bump
  the local shared reference separately.
- Runtime: Node.js 22.22.3; package manager: pnpm 11.17.0.
- Install with `pnpm install --frozen-lockfile`; run the full contract with
  `pnpm check`.
- Use `pnpm changeset` for an observable published-package change.
- Generated tokens, package metadata, and `skills/ui-web` are checked-in
  projections. Change their source owner and run `pnpm generate`; do not edit
  generated output directly.
- Follow the organization-wide [Verification and Test Policy](https://github.com/InKCre/.github/blob/main/TESTING.md).
  This repository prefers type-check, lint, generated-contract checks, story builds, and real
  consuming-page review; it currently admits no automated unit/component suite.
- Require explicit Human authorization before commit, push, publication, or
  external repository/settings mutation.

当前任务的范围、决策与验证记录保存在 [UI 基础能力工作包](tasks/ui-foundations/packet.md)。继续本任务时先读取工作包和当前组；它不替代上述长期知识入口，也不将尚未启动的组视为实现授权。

<!-- svc:begin -->
## SVC

Use `svc --help` or `svc <command> --help`.

- `svc status`: inspect project state
- `svc lookup`: read SVC guidance
- `svc task init`: create a task packet
- `svc task grow`: inspect packet shape without changing files
- `svc dev`: manage declared development targets

If `AGENTS.local.md` exists, read it after this file. It is ignored local guidance; shared rules belong here.
<!-- svc:end -->
