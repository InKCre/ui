# Web 组件维护指南

遵循[包级约定](../../AGENTS.md)。每个组件目录包含 Vue 实现、TypeScript 契约和组件样式；不要求附带单元／组件测试文件。

| 文件                                          | 内容与指南                                                               |
| --------------------------------------------- | ------------------------------------------------------------------------ |
| `compName.vue`                                | 模板与交互逻辑；[Vue 指南](AGENTS.comp-vue.md)                           |
| `compName.ts`                                 | props、emits、类型及必要的辅助逻辑；[TypeScript 指南](AGENTS.comp-ts.md) |
| `compName.scss`                               | 组件样式；[样式指南](AGENTS.comp-scss.md)                                |
| `../../stories/<category>/compName.story.vue` | 代表性用例；[Story 指南](AGENTS.comp-story.md)                           |
| `../../stories/<category>/compName.story.md`  | 行为与使用说明；[文档指南](AGENTS.comp-doc.md)                           |

公开组件身份和分类由 [component-manifest.json](../../component-manifest.json) 管理。实现与类型是 API 事实的源头；说明文档解释行为、理由和限制，任务规划放在当前工作包中。

## 修改步骤

1. 阅读实现、Story、相关文档和实际调用，确定要改变的可观察行为及兼容范围。
2. 在负责该行为的组件或共享边界修复。优先复用已有能力；只为真实复用或清晰责任建立辅助模块。
3. 更新受影响的 Story 和说明；涉及组件身份或 Skill 输入时更新源头，再从仓库根执行 `pnpm generate`。
4. 运行与改动相关的验证，交互和视觉变化核对真实页面，交付前运行根级 `pnpm check`。具体取证遵循根约定，不将 Story 数量当成行为覆盖。
5. 公开包变化使用 `pnpm changeset` 记录；在工作包中记录结果、兼容影响和未完成的下游事项。

外部未知输入使用 `unknown` 并在边界收窄类型；避免用 `any` 或类型断言掩盖无效输入。失败应在有处理能力的边界明确表达，不能一律转成成功、空值或静默降级。

沿用现有组件与文件命名，CSS 类使用 BEM。模型和事件名称遵循公开契约，不因套用命名惯例而改变 `update:modelValue` 等已有接口。
