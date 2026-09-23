# 第四组：UI 生产者交付记录

本工作项服务于 client-web 的 `tasks/peer-extension-experience/track-interaction-quality.md`；该父工作包拥有第四组范围与 Human 复核，本文件只记录 UI 生产者交付。

Human 再次明确该修复属于第四组，不单独推进为修复项目。此 worktree 仅隔离 UI 源码，范围、复核与后续发布编排继续由父工作包统一管理。

用户已确认 Create Source 的 Type 列表顶部并非多余布局空白，而是搜索区无提示。要求增加适当 padding 与前缀搜索图标。拥有 InkDropdown 模板、样式、既有说明和 patch Changeset；保留公开 API、搜索模型与键盘事件，不在消费者添加覆盖。

实现使用现有 Token 与图标机制，以 label 包住图标及原生搜索 input，整行可点击聚焦，键盘焦点在搜索区内部显示。验证包含完整 `pnpm check`、实际浏览器空搜索区图标与间距、点击图标、过滤、键盘选择与 Escape，以及窄容器。正式发布前 client-web 仍消费 UI 2.1.1，源码或 Story 验证不代表公开 PR preview 已更新。

完整 `pnpm check` 已通过，包含真实打包安装与 22 个 Story 的构建。构建产物在浏览器中确认搜索区高 36px、padding 8px、图标 20px 且有实际 SVG mask 填色；点击图标会聚焦输入，过滤“2”后 Enter 选择 Option 2，触发器输入“3”进入过滤且显示 2px 焦点轮廓，Escape 保留原选择并返回触发器。360px 宽度下 scrollWidth 等于视口宽度，搜索区和选项无横向溢出；已查看桌面及窄屏截图。

首次浏览器检查发现点击 label 图标会在原有 focusout 关闭逻辑下提前收起列表；现仅阻止搜索区非 input 目标的 mousedown 默认失焦，保留 label 原生点击聚焦与 input 文字选择，复验通过。client-web 本地源码联调受当前 external 数据库运行时未就绪阻挡，已停止本轮启动尝试。公开 PR preview 尚未更新；未发布包、未修改消费者锁文件。

2026-09-23：按父工作包第四组授权补齐 Loading 的 blocks/spinner 与可见 label、无业务 props 的 InkSkeleton、三类等待图形的 reduced-motion，以及 Dialog 交互锁和 Button 自身 loading 的职责拆分。default/footer 槽均提供 cancel/confirm/isLoading，自定义执行按钮显式绑定。五个 ref.space 改为 rem；既有 Figma 导入拒绝 dimension 单位变更，夹具验证 rem 保留及 px/em 回退无写入。Story、迁移、skill.seed、页面组合正文和生成物已同步，新增 minor Changeset；没有提交、推送或发布。

完整 pnpm check 通过：包括格式、lint、生成物、Skill、23 组件 Story 覆盖、Token 夹具、类型、构建、独立 tarball 安装与公开入口契约，以及 23 个 Story / 125 个 Variant 构建。Token 循环引用错误属于既有预期失败夹具；Histoire alpha 的 setup 导出和重复 UnoCSS 提示不阻止构建。新增状态尚待父任务实际浏览器验收，不能把构建通过视为视觉结论。

验收入口是 Feedback/Dialog 的 Async（Promise 成功/失败、默认 Confirm 动画与关闭锁）、Custom footer failure and retry（两秒保存、失败保留输入，取消不转圈；去掉模拟失败后重试成功）、Without Cancel（显式布尔 pending）；Feedback/Loading 的三个 Variant 和 Feedback/Skeleton 的 Known list structure。继续按父包核对浅深色、360px、20px 根字号、reduced-motion 与真实 consumer。范围、验收和交付编排仍只由父工作包维护。

Loading 命名补正：WAI-ARIA 的 status 仅支持作者提供名称，不能依靠子文本自动命名。label 现在明确作为根 status 的 aria-label；可见文字节点与图形 aria-hidden，避免名称后再读相同内容。无 label 时仍接受 aria-label。规范依据为 [WAI-ARIA status](https://www.w3.org/TR/wai-aria-1.2/#status) 与 [APG 命名说明](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/)，Story 与生成指南同步该契约。

补正后完整 pnpm check 再次通过。已在实际 Chrome 构建 Story 验证：getByRole(status, exact name) 分别唯一命中“正在读取预览”“正在读取类型”“正在追加日志”；可访问性树只保留对应状态名称，没有重复的同文子节点。动态播报的具体语音时机仍取决于屏幕阅读器，本次没有将可访问性树检查称为听觉实测。

依赖方向复核后，私有 buttonDisabledKey 归入 InkButton 契约，Dialog 作为组合组件提供禁用状态；Button 不再依赖 Dialog 文件或概念。公开根入口没有新增该 key，行为与既有消费者说明保持不变；生成与完整 pnpm check 再次通过。
