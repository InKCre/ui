# Story 编写指南

Story 位于 `packages/web/stories/<category>/`，分类与公开组件身份来自 `component-manifest.json`。选择代表性用法、重要状态转换和具体容易回归的边界，不枚举全部参数组合。

每个公开组件至少有一个 Variant。Variant 标题说明用户能观察到的状态或操作；需要解释步骤、前置条件和预期结果时，在对应 Story 文档中写明。简单组件不为了满足数量规则虚构边界案例。

Story 是可操作的示例和验收入口。`pnpm check:stories` 检查清单、文件、分类标题和 Variant 是否存在；`pnpm story` 检查展示构建。两者都不自动证明键盘、焦点、异步或视觉行为正确，这些变化需要实际操作验证。

全局 router、i18n 和主题适配放在 [histoire.setup.ts](../../stories/histoire.setup.ts)。场景专用状态放在 Story 中；需要验证注入上下文时，使用负责该上下文的真实组件或明确的场景包装，不改变全局默认值来迁就一个案例。

从仓库根运行 `pnpm story:dev` 查看用例。修改完成后检查用例是否能稳定演示目标行为，说明是否与实际操作一致；只有当静态和现有黑盒证据不足且收益明确时，才按组织政策讨论新增自动化。
