---
"@inkcre/ui-web": major
---

完善主题与控件基础契约：显式按钮提交、日期确认草稿、原生模态焦点、schema 实例隔离及原始 JSON 编辑模型；同步迁移指南与校验状态。

- InkButton 默认原生类型为 button，提交改用 nativeType="submit"；Vue peer 收紧到 ^3.5.25。
- InkJsonEditor 的模型改为原始文本。下游必须使用字符串草稿，监听 validation，仅在 valid=true 且 text 与草稿一致时解析和保存，不能在模型 setter 中直接 JSON.parse。
- InkPicker 在确认后才更新 Date，取消丢弃草稿。Popup/Scrim 使用原生 dialog，保留 scrim=false 非模态行为；消费者需提供可访问名称。
- 修复无效 Token 引用、显式主题优先级和阴影单位，将内置图标及工具类纳入包 CSS，关闭 UnoCSS preflight；完善字段关联、键盘操作、异步竞态与失败事件。
- AutoForm 保留已有值，正确处理数字和日期字符串；schema 服务配置及缓存按实例隔离，保护调用方 schema，根级错误和服务不可用均可见。

具体迁移步骤见随包 MIGRATION.md；本 changeset 不表示下游已经升级。
