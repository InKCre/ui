# UI Web Agent Skill

`build-agent-skills.ts` generates the single TanStack Intent skill shipped by
`@inkcre/ui-web` at `packages/web/skills/ui-web/`.

## Owners

- `packages/web/skill.seed.json` owns reviewed component intent, selection,
  composition, integration, styling, and mistake guidance.
- Component source, the public component manifest, and Histoire stories own
  mechanically derived API and variant facts.
- `scripts/build-agent-skills.ts` combines those sources into the generated
  skill and references. Generated files must not be edited directly.
- `scripts/check-package-contract.ts` proves the packed package exposes the
  skill at the discoverable `skills/ui-web` path and excludes the retired
  `agent-skills/` path and maintainer seed.

## Commands

```bash
pnpm build-skills
pnpm check:skills
```

Use `pnpm build-skills` after changing a source owner. `pnpm check:skills`
rejects stale generated output and validates the result with TanStack Intent.

包内的 `build:skills` 只运行过期检查，不写入 Skill；需要重新生成时使用上面的根级命令，或 `pnpm --filter @inkcre/ui-web skill:generate`。生成会重建整个 `skills/ui-web` 目录，不在其中保存手工维护文件。

当前生成器提取 props／events 名称、slot 名称和 Story Variant 标题，并合并人工维护的选型指导。它不保证已覆盖所有 Vue 模型、类型或行为语义；结构校验成功也不等于 API 文档完整。修改公开契约时同时核对源码、声明和生成参考。

安装与发现方式见 [Web 包说明](../packages/web/README.md#agent-skill)。消费者需要显式配置可信包与 Intent CLI；也可直接阅读随包 Markdown。

This product skill belongs to the published UI package. Organization-wide
Agent workflow skills and repository instructions have different consumers
and do not belong in this package.
