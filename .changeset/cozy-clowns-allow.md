---
"@inkcre/ui-web": major
---

统一文本角色、主题语义和运行时 Token 读取，迁移可增长控件及随包使用指南。

- 文本尺寸使用 rem 和比例行高，统一系统 UI／mono 家族；移除 label-sm 及独立复合角色，新增 body-sm/body-md/title-lg。Sass 与 Uno 完整读取文本角色及 space/radius 的运行时变量。
- text.primary/danger-on 改为 on-primary/on-danger，移除语义含糊的 muted 颜色，补齐反馈前景和保留 alpha 的遮罩。按 MIGRATION.md 逐处迁移颜色用途、Sass 调用和旧 CSS 覆盖。
- 控件允许随文本增长，Switch 状态文案不再引起宽度跳动，Button pending 保留标签与相邻 spinner；Textarea 普通文本默认 sans，代码显式 mono。
- Figma 仅提议已知路径值更新，保留仓库契约并要求显式发布分类。样式指南及随包 Skill 提供默认组合、覆盖范围和迁移路径。
