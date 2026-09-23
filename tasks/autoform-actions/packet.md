# InkAutoForm 动作按钮统一

- **目标**：`InkAutoForm` 的可空字段和数组操作与其普通字段一样使用 InkUI 控件。
- **边界**：仅修复五处原生按钮的视觉与交互一致性；保留现有模型更新、禁用语义、非提交按钮和 JSON Schema 范围。不新增按钮抽象或 UI 规则。
- **完成证据**：受影响 Story 能操作 Set/Clear/Add/Remove，禁用与嵌入表单不意外提交；包检查与正式构建通过；有 patch Changeset；client-web 的 Source/Peer 消费页复核。
- **当前事实**：五处数组/可空字段动作已改用现有 `InkButton size="sm"`，保留按钮的非提交、禁用和模型更新语义；Story 说明与 patch Changeset 已更新。`pnpm check` 通过（22 个 Story、122 个 variant）；在浅色桌面 Story 中实际检查 Set/Remove/Add 的 InkButton 外观，Set value 会更新数据，禁用动作保持不可操作。此分支从最新 `origin/main` 独立创建，避免复用已交付的 schema-forms PR。
- **下一步**：Human 已授权 UI 提交、推送、Draft PR 与正常版本发布，并允许 client-web 消费。交付后对真实 Source/Peer 表单复核；在 client-web 升级之前，当前公开 preview 仍使用 UI 2.1.0，不能把本地修正算入其验收。
