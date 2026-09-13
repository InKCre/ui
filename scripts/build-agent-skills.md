# UI Web Agent 文档生成

`build-agent-skills.ts` 生成 `packages/web/skills/ui-web/`，并把根级 DESIGN.md 同步到包内。两份 DESIGN.md 内容一致，只有仓库根级源允许人工编辑。

## 内容责任

DESIGN.md 拥有共同设计判断；`skill.seed.json` 拥有组件意图、选型、组合步骤和集成注意事项。组件源码与公开类型拥有 API 事实，Story 拥有可运行示例与展示状态。生成器组合这些来源，生成目录不保留手工文件。

API 通过 Vue 官方 `vue-component-meta` 读取 props、models 对应的更新事件、事件载荷和插槽参数，枚举类型展开为可读选择。工具版本与 vue-tsc 一致。Vue 元数据不能识别本库 prop helper 的默认参数，因此 `lib/component-api.ts` 用 TypeScript AST 补读这些 helper 调用；不执行组件或默认工厂，未知 helper 或无法定位的声明明确失败。更改 helper 语义时须同步这段适配并复核生成结果。

模型由实际 prop 与同名 update 事件配对识别。props 默认列是声明值／表达式，不能把 undefined 当成组件内部没有显示回退。泛型组件可能保留 Vue 推导的条件类型；模型载荷与组件说明一起解释其使用边界。工具发现结构不代表行为已经得到验证，不能从元数据推断确认取消等语义。

完整配方存放在 `packages/web/stories/recipes/*.vue`，由普通 Story 引用，seed 只保存 `exampleFile`。同一源文件被嵌入随包 Markdown；包契约检查从安装后的 Markdown 提取这些代码块，核对与源文件一致，再以公开入口通过类型检查和构建。摘要步骤可以解释设计意图，不再维护另一份代码字符串。

## 命令与交付

```bash
pnpm build-skills
pnpm check:skills
```

前者写入生成物与设计指南副本；后者检查过期内容并验证 Intent 结构。包构建中的 `build:skills` 也执行过期检查。总检查中的 `check:generated` 只重建 Token 和包元数据，Skill／DESIGN.md 的一致性由包构建检查，Intent 结构单独检查，避免重复生成同一批文档。

`check-package-contract.ts` 从 tarball 在临时目录独立安装，读取同版本 DESIGN.md 和 Skill，检查包内链接与 Intent 发现。允许包内相对跳转，不允许逃出安装包去读取生产者源码或任务记录。

安装与发现方式见 [Web 包说明](../packages/web/README.md#agent-skill)。消费者显式配置可信包；也可以直接读取 Markdown。组织工作流 Skill 和仓库维护授权不随产品包分发。

需要复查临时消费者时，运行 `pnpm exec tsx scripts/check-package-contract.ts --keep`，结束输出其目录。该目录包含本地 tarball、独立依赖、从指南提取的配方和 Vite 入口；检查完毕后可删除。不带 `--keep` 时自动清理。
