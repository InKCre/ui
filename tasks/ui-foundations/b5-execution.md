# B5 正式迁移实施记录

状态：仓库内已验证，实现已随 B—E 整理为 b9c0bc6；真实发送端与消费者联调待 G 补证。用户于 2026-09-13 要求“处理 B5”，授权按 B4 已选规则完成源、输出、组件、文档、Changeset 与必要验证；B5 实施阶段未提交、推送、发布或修改消费者仓库；后续用户明确授权整理提交，当前提交状态见 [packet](packet.md)。

## 执行顺序

1. 迁移 Token 角色、单位、透明度及生成器的公开读取关系；在隔离根目录检查。
2. 收紧导入的已知路径更新和发布分类，复用现有 fixture；真实发送端信息若缺失，明确证据范围。
3. 迁移全部受影响组件、对应 Story、样式指南、Skill 输入和兼容说明。
4. 生成并打包，以最终产物复核 B4 场景，执行完整 pnpm check。

基线：HEAD c5b230af2461d401fa9dc3ac8d5b356c20b89c46；非本轮改动保留。B4 基线 tarball 与证据归档不覆盖，B5 使用独立实验目录。

## 用户补充的验收边界

用户在实施期间要求停止继续处理 Firefox 原生 200% 文字放大的专项适配，优先完成 Token、组件和实现的基本质量。自此不再扩展该专项，也不增加浏览器专属补丁。此前已完成的 Firefox 测量作为历史证据保留；后续验证聚焦正式产物的默认布局、公开入口、交互与文档一致性。rem、比例行高、换行和可增长的最小高度属于已认可的通用基础规则，继续保留。

## 已完成的正式实现

Token 源从 237 个叶节点收敛为 150 个：文本尺寸只保留八个基础角色的四属性，家族和装饰单独选择；补正文与标题需求，统一 rem、比例行高、系统 UI／mono 字体。颜色明确普通前景与 on-primary/on-danger 的配对，移除含糊的 muted，补反馈前景和保留 alpha 的共享 scrim。静态间距尺度、现有 Switch 组件配色和构建时尺寸保持各自责任。

生成器复用 Style Dictionary 解析引用，增加仓库输入边界，移除剥离 alpha 的转换。Sass 与 Uno 使用相同运行时文本变量；Uno space/radius 也读取系统变量。产物检查实际发现 Wind3 无法解析原有 kebab 复合颜色键，已按其 camelCase theme 约定修正，并验证对应公开工具类。

Figma 导入改为已有叶路径的值提议。遗漏节点及仓库元数据保留，未知路径、类型、引用或说明冲突直接失败；要求显式 patch/minor/major。候选先在临时根验证、生成，成功后才写源、输出和 Changeset；无变化不创建 Changeset，写入失败恢复已有文件。没有新增第二份规范源、通用解析／版本推断框架或依赖。

全部 21 个组件已扫描；19 个组件需要样式或必要模板迁移，Form 的组间距和 Loading 的独立尺寸已有合适规则，保留实现。主要变化如下：

| 范围 | 正式行为 |
| --- | --- |
| Field、Input、Textarea、Dropdown、Picker | 明确 label/body 角色、长文本换行、错误段落间距、带框最小高度、独立 focus；Textarea 可显式 mono。 |
| Button、Switch、Pagination、Header | Button 保留 pending 文本、使用主题状态表面；Switch 两状态共同决定轨道，Pagination 与 Header 保留操作空间及换行。 |
| Popup、Scrim、DoubleCheck、Dialog、Image | 共享半透明遮罩、标题合法前景、单一内边距及有界弹层、图片标题独立底板。 |
| JsonEditor、AutoForm、DatetimePickerView、Tooltip、Placeholder | 对应文本角色与反馈前景迁移；代码字体读取 mono，保留此前模型、日期与校验行为。 |

全组件取证发现 Dialog 与 DoubleCheck 都存在中心定位下自动宽度过窄、内边距重复的问题。DoubleCheck 按 B4 采用最大 400px；Dialog 沿用同一内边距责任，采用最大 640px；两者窄视口各留 16px。自定义类作用于 Teleport 的实际 dialog 根节点，不能依赖父 scoped 属性。这是通用布局修正，没有引入浏览器专属分支或新 Token。

长期说明更新至 tokens/tokens.md、scripts/build-tokens.md、styles/README.md、Story 文档、skill.seed.json 和 MIGRATION.md。恢复了独立样式指南，明确默认表单、角色选择、CSS/Sass/Uno 用法、主题／覆盖边界和已知 client-web 迁移位置。Skill 生成器仅增加配方示例字段，没有扩展为 API 提取框架；通用事实提取仍归 F。

使用 `pnpm changeset` 新建 [major Changeset](../../.changeset/cozy-clowns-allow.md)，说明破坏性变化和升级方式。package.json 与 pnpm-lock.yaml 相对 B5 开始时哈希未变，没有提升版本、增加依赖、提交、推送或发布。

## 验证结果与交接

最终 `pnpm check` exit 0：格式、lint、生成物／Skill／Story 一致性、Token 导入 fixture、类型、构建、公开包契约及 Histoire 均通过。共有 21 个 Story、117 个 Variant。包契约覆盖两种包身份，实际 CSS 无缺失 Token，公开 Sass 和 Uno 验证文本属性、零值、装饰、无效角色拒绝、运行时读取和透明度；随包 README／Migration／样式指南的相对链接可解析。

最终 tarball 的默认消费页通过：三个容器宽度、浅深主题、动作状态／焦点、Dropdown 选中说明、Switch pending 与状态切换、CSS/Sass/Uno 根覆盖、Teleport 边界、字体回退、JsonEditor 与 Textarea 的 mono、Skill 保存配方成功／拒绝路径。C/D/E 既有原生表单、键盘、模态、日期及 schema 旅程也已用 B5 公开产物重走。人工查看默认表单、深色状态、Dialog 与图片标题截图。详细产物身份、测量、日志和复核方法见 [B5 证据](b5-evidence/README.md)。

仓库内 B5 已验证。真实 Figma 发送端代码／payload 未获得，不能声称发送端已经适配；当前仅有受限接收端契约及 fixture 证据。该实际联调和 extension registry 位置、client-web 版本升级由 G 接续；没有修改消费者仓库。用户要求停止的 Firefox 专项不再作为 B5 未完成事项。
