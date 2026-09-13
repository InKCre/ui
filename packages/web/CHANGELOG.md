# @inkcre/ui-web

## 2.0.0

### Major Changes

- 2b553ab: 完善主题与控件基础契约：显式按钮提交、日期确认草稿、原生模态焦点、schema 实例隔离及原始 JSON 编辑模型；同步迁移指南与校验状态。
  - InkButton 默认原生类型为 button，提交改用 nativeType="submit"；Vue peer 收紧到 ^3.5.25。
  - InkJsonEditor 的模型改为原始文本。下游必须使用字符串草稿，监听 validation，仅在 valid=true 且 text 与草稿一致时解析和保存，不能在模型 setter 中直接 JSON.parse。
  - InkPicker 在确认后才更新 Date，取消丢弃草稿。Popup/Scrim 使用原生 dialog，保留 scrim=false 非模态行为；消费者需提供可访问名称。
  - 修复无效 Token 引用、显式主题优先级和阴影单位，将内置图标及工具类纳入包 CSS，关闭 UnoCSS preflight；完善字段关联、键盘操作、异步竞态与失败事件。
  - AutoForm 保留已有值，正确处理数字和日期字符串；schema 服务配置及缓存按实例隔离，保护调用方 schema，根级错误和服务不可用均可见。

  具体迁移步骤见随包 MIGRATION.md；本 changeset 不表示下游已经升级。

- 2b553ab: 统一文本角色、主题语义和运行时 Token 读取，迁移可增长控件及随包使用指南。
  - 文本尺寸使用 rem 和比例行高，统一系统 UI／mono 家族；移除 label-sm 及独立复合角色，新增 body-sm/body-md/title-lg。Sass 与 Uno 完整读取文本角色及 space/radius 的运行时变量。
  - text.primary/danger-on 改为 on-primary/on-danger，移除语义含糊的 muted 颜色，补齐反馈前景和保留 alpha 的遮罩。按 MIGRATION.md 逐处迁移颜色用途、Sass 调用和旧 CSS 覆盖。
  - 控件允许随文本增长，Switch 状态文案不再引起宽度跳动，Button pending 保留标签与相邻 spinner；Textarea 普通文本默认 sans，代码显式 mono。
  - Figma 仅提议已知路径值更新，保留仓库契约并要求显式发布分类。样式指南及随包 Skill 提供默认组合、覆盖范围和迁移路径。

- 2b553ab: 完善面向消费者与维护者的设计和 API 文档，并校准独立安装契约。
  - 随包交付同源 DESIGN.md，补齐模型、类型、默认值、事件与插槽参数，完整配方直接来自可检查的 Story 源文件。
  - 内部编辑器、JSON 服务、VueUse 和日期依赖由包自行安装，路由适配器不再要求 vue-router peer，UnoCSS 继续为可选集成。
  - Vue 最低版本改为 3.5.25，以匹配实际生成声明；升级时同时校准 Vue。包契约使用独立安装并关闭 skipLibCheck 验证公开入口。
  - 修正组件注册表的声明展开，并直接生成 Uno preset 声明，避免公开入口不必要地依赖配置工具类型。

### Patch Changes

- 2b553ab: 校准 Web 包安装、样式与迁移指南，修正开发约定和生成物维护入口。

## 1.4.0

### Minor Changes

- 5b9072d: Add modeless InkPopup rendering through the backward-compatible `scrim` prop.

## 1.3.1

### Patch Changes

- 5c9e3d0: Document the consumer-owned local source loop and make the source entry compatible with strict consumer type graphs.

## 1.3.0

### Minor Changes

- f9a65a3: Give the web package first-class Oxc and native TypeScript development
  workflows, and replace the non-discoverable `agent-skills/` folders with the
  installed, validated `@inkcre/ui-web#ui-web` TanStack Intent skill.

### Patch Changes

- b1e0d6a: Fix uncontrolled image expansion and reliable scrim close-button behavior.
- 322dcf6: Move GitHub Packages routing and repository metadata to the publishable package.
- 5d05693: Publish the renamed web UI package with complete exports, deterministic generation, packed-consumer verification, and a categorized Histoire catalog.

## 1.2.2

### Patch Changes

- e74f929: Add InkImage and InkScrim

## 1.2.1

### Patch Changes

- 1856fb9: Update InkDropdown: add stepping
- 582944b: Update InkDropdown: support arrow up/down navigation
- ebd2b76: Fix: InkDialog open issue
- 7d445ad: upd(InkButton): support prop `icon` and rename `icon` type to `square`
- dd9e768: Update style: add UnoCSS preset
- 60abffb: Update InkDropdown: support incremental search

## 1.2.0

### Minor Changes

- 31b01fd: Add internationalization support with vue-i18n. Library now supports en and zh-CN locales, with consumers able to provide their own i18n instance.

### Patch Changes

- 6506b64: Update InkDropdown: load lazy options if modelValue is set
- f51bdf6: Fix InkButton size style lost
- f9c5d5d: Fix: InkButton make breaking changes to prop `type`

## 1.1.6

### Patch Changes

- 8ebafb5: InkButton: move `type` to `theme`, add `type` icon
- 926f109: Fix inkLoading size not work
- 4b2e070: Add inkAutoForm
- aa19a81: Add inkPagination component with page buttons and prev/next navigation
- a42627f: Fix InkDropdown: display description

## 1.1.5

### Patch Changes

- 7882d27: Optimize histoire DX by adding necessary highlights back

## 1.1.4

### Patch Changes

- 083700b: Update InkDropdown: separate loader from options
- 89ef855: InkJsonEditor ensures modelValue is valid JSON string

## 1.1.3

### Patch Changes

- 467753c: Optimize histoire build size of web-design package (33mb -> 1.2mb)
- c663933: Add inkPlaceholder component for empty and error states

## 1.1.2

### Patch Changes

- 9aa3cae: Fix inkJsonEditor to react to schema changes. Added a watcher for the schema prop to reconfigure JSON validation and autocomplete when the schema updates.

## 1.1.1

### Patch Changes

- e0614a1: make InkHeader load page title from router automatically
- 52e5ce6: Fix inkJsonEditor collapse in popup
- 4fb87ce: Move styles to root.
- aaf60e8: Fix InkLoading flashing
- fca79fd: ref InkDialog to reuse InkPopup

## 1.1.0

### Minor Changes

- c4801e8: InkJsonEditor supports JsonSchema

### Patch Changes

- adea8b8: Add inkDialog component and loading state support for inkButton
- 32c8290: Add UnoCSS + mdi icons
