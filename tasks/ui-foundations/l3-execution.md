# L3 执行记录

2026-09-13，用户确认 [L3 方案](plan-l3-design-docs.md) 并要求开始实施。基线为 `c67cc88`；前轮讨论对工作包的修改保留。

## 范围与验收

本轮拥有根级 DESIGN.md 与维护导航、Web 消费文档与 Skill 输入／生成物、API 事实生成器、代表配方、包声明／构建边界及既有验证脚本。设计原则复用 L1/L2 已确认结论；API 事实必须包含模型、类型、默认值、事件和插槽参数；代表配方通过公开包入口检查；包在临时目录独立安装，文档与指南可在安装产物中读取。

不改变 L1/L2 已确定的运行时交互，不建立新文档平台、单元／组件测试套件或多端 renderer；不重启 Firefox 原生文字放大专项。只读检查消费者，不修改其 checkout；未授权提交、推送或发布。

## 交付状态

| 切片 | 本轮结果 | 剩余边界 |
| --- | --- | --- |
| F0 | 根级 DESIGN.md 成为共同设计判断源，整理既有重叠说明 | 首版归档已接受的 L1/L2 决定；新增品牌或平台政策仍需讨论 |
| F1 | 21 个组件的模型、props 类型／必需性／默认值、事件载荷、插槽参数已生成 | InkPicker 的泛型条件类型仍较长，保留事实与说明，未自造类型简化器 |
| F2 | 三份完整配方由 Story 与安装包文档共用，通过类型、构建与浏览器验证 | 代表任务可用，不作为所有 Agent 质量的普遍证明 |
| F3 | 同源 DESIGN.md、Skill、导航及包内链接已在独立安装中验证 | 消费者需配置读取入口；不能声称已在其 Agent 中启用 |
| G1 | 核对 client-web、mail、twitter 的版本、调用及 Agent 配置，并运行真实源文件的声明兼容检查 | extension registry 的独立 UI 位置与实际 Figma 发送端尚未获得 |
| G2 | 内部依赖责任、Vue 最低版本、可选 Uno 集成及 major Changeset 已校准 | 包仍标记 1.4.0，尚未发布新的 major |
| G3 | 独立最小安装、公开声明、指南代码、Intent、Sass/Uno 已验证；删除重复检查 | 真实消费者尚未迁移和完成页面验收，详见接入事项 |

本仓库实现与本地交付检查已完成；L3 的跨仓接入仍有明确未完成项。没有提交、推送、发布或修改消费者 checkout。

## 设计指南与 API 文档

根级 [DESIGN.md](../../DESIGN.md) 同时帮助消费者选择能力、帮助维护者判断改变应由何处承担。正文覆盖任务、文字角色、颜色配对、内容增长、组件组合、异步状态、主题及扩展判断；不复制 Token 值表或组件接口。根／包级 AGENTS、README、文档索引与 Skill 提供读取路径。Token 指南保留格式和维护责任，Web 样式指南保留 CSS/Sass/Uno 调用与传播边界。

包内 DESIGN.md 由既有 Skill 生成命令复制，字节一致性与过期检查覆盖它；仅根级源可人工编辑。README 的相对链接在仓库与安装包内都成立。消费者读取安装版本；未发布源码中的规则不冒充 registry 1.4.0 的现有内容。

[生成器](../../scripts/build-agent-skills.ts) 使用 Vue 官方 `vue-component-meta@3.3.8`，与现有 vue-tsc 同版本。删除原先手工追踪对象、展开、槽名称的解析路径。模型由实际 prop 与 update 事件配对；例如 InkPopup 的 `v-model:open` 不再只出现在人工 caveat 中，InkDialog 的作用域槽参数也进入生成参考。

官方工具不能求出本库 prop helper 的默认参数，因此用一个小型 [AST 适配器](../../scripts/lib/component-api.ts) 读取已知 helper 的实参，既不执行组件模块，也不执行默认工厂。未知 helper 或声明无法定位会失败；显式公开类型从实际 TypeScript 声明读取，人工 seed 只选取所需名称。对过期 DESIGN.md 与未知 helper 做了两次临时扰动，检查均按预期失败，随后原样恢复并重新检查。证据见 [generator-boundaries.json](l3-evidence/generator-boundaries.json)。

没有继续为 InkPicker 的 Vue 泛型条件类型编写化简规则。模型事件的 T、内置日期必须使用 Date、自定义槽由消费者负责提交等边界均有说明；生成类型结构与行为说明承担不同责任。

## 代表配方与设计指南演练

[SettingsForm.vue](../../packages/web/stories/recipes/SettingsForm.vue) 表达名称校验、明确提交、保存 pending、失败保留草稿和成功反馈；[HostIntegration.vue](../../packages/web/stories/recipes/HostIntegration.vue) 表达路由／语言适配器和根级主题；[JsonConfiguration.vue](../../packages/web/stories/recipes/JsonConfiguration.vue) 保留原始 JSON，只有当前文本对应的校验通过才解析保存。宿主通过 save 属性提供真实持久化函数，Story 使用可失败的模拟保存。

三个文件经公开包名导入组件，Story 与随包 Markdown 使用同一份源。包契约检查从实际安装的 Markdown 提取代码块，核对与源文件一致后编译和构建，因此也能发现文档遗漏或过期。浏览器验收曾发现集成配方遗漏 Dialog 确认后的关闭动作；已按实际 confirm 事件契约修正示例并复验，没有修改组件运行时。

消费者演练从已安装的 Skill、DESIGN.md 和配方完成普通设置保存及失败反馈，核对保留动作文字、禁用重复提交、保留草稿和正确反馈。维护者演练的输入是“窄容器出现长字段标签，是否新增更小的文本角色”：从 AGENTS 进入 DESIGN.md，再核对 InkField 的 label-lg、正常换行、overflow-wrap 和列布局，以及 InkInput 的 min-height。结论是保留标签职责，先选列布局并允许内容增长；一个页面的长度问题不足以新增 Token。若后续出现不同用途且多个场景需要共同变化，再提出新角色及证据。

上述是本轮的人工查阅与任务演练；未安排独立 Agent 对照评测，也不推断普遍生产力收益。浏览器结果与复跑说明在 [证据入口](l3-evidence/README.md)。

## 依赖和声明的实际问题

CodeMirror、JSON 语言服务、VueUse 与 dayjs 由包声明为 dependencies；Vue 是宿主共享的 peer，UnoCSS 为 `/uno` 的可选 peer。适配器只使用公开 InkRouter 接口，不要求 vue-router。Vite 仍把运行时依赖留作外部导入，调整安装责任没有把它们全部捆进 UI bundle，也没有拆新包或增加运行时框架。

独立安装使用 Vue 3.5.0 且关闭 skipLibCheck 后发现，Vue 3.5.25 生成的组件声明包含旧声明不支持的泛型参数。最低版本改为 3.5.25，并在独立消费者显式固定该下限。另一个真实问题是组件注册表的类型推导展开了大量 Vue 内部构造器；生成显式 `typeof InkX` 映射后，其公开声明为 45 行，保留原运行时对象。

JSON 语言服务固定为已验证的 5.6.4。client-web 安装的 5.7.2 改变了诊断消息类型与 schema 错误码；宽泛范围会使新安装违背组件当前边界。后续升级应验证消息与失败状态，源码联调也不应强制替换内部版本。

Uno preset 改用普通函数返回通过 `satisfies Preset` 检查的对象，并由编译器生成真实声明，删除手写 PresetFactory 声明补丁。隔离安装曾解析到 `unconfig@7.5.0`，其声明引用未声明的 Args；通过聚合类型引入这段 CLI 配置类型会让 UI 的可选入口在严格检查中失败。新声明去掉这项不必要关联；没有修复或覆盖上游 unconfig。消费者若直接检查受影响的 Uno 配置工具声明，仍可能遇到上游问题。

独立安装不链接生产者 node_modules；工具链固定 TypeScript 5.9.3、vue-tsc 3.3.8、Vite 7.2.7，Intent 也安装在消费者中。先只安装 UI、Vue 与检查工具验证普通组件，再安装可选 Uno 验证对应入口。最小入口与可选入口的 UI 公开声明均关闭 skipLibCheck。生产者既有 TypeScript bridge 和工具链策略保留。

总检查删除重复 Skill 生成与包类型检查；单独 build 仍检查类型与指南新鲜度。移除已经没有实际消费证据的旧包名模拟复检，保留当前身份的真实 tarball 检查和历史迁移说明。

## 真实消费者与接入事项

client-web checkout 为 `367ace98bfb7e9880c002e7971eb397a25c9ef84`。三个本地包都声明 `@inkcre/ui-web@1.4.0`：

| 消费位置 | 本轮观察 | 验证边界 |
| --- | --- | --- |
| `apps/client-web` | 设置／搜索／关系图／Peer 配置／浮层；24 个源码文件有 UI 导入，实际 Vue 3.5.40 | 真实源文件改指向本地产物声明、共享宿主 Vue 后，留下两个 graph 按钮回调类型错误 |
| `extensions/mail` | 邮件与附件下载按钮，入口导入 UI 样式 | 指向同一本地产物声明的类型检查通过；两个下载按钮使用错误的 loading 属性，静态通过不能证明 pending 正确 |
| `extensions/twitter` | 入口导入 UI 样式，设置页面使用扩展自己的控件 | 指向同一本地产物声明的类型检查通过；未做扩展业务流程验收 |

检查未改三个消费者的依赖或源文件；沿用其现有 TypeScript 检查选项，不把这种声明替换实验等同真实升级。已检查的根／Web package.json 与 AGENTS 未发现 UI Intent 信任配置或对应读取入口，不能推定其他未检查工具完全没有配置。

本地 ext-reg 为 `60879eb437c29108a85873e2745e0b5b854787c0`，是 Python／Worker 工程，未找到 UI package。其 setup wizard 文档指向 Web Host 与扩展各自拥有的 UI，这与上述消费图相容，但不能据此认定用户所说的 extension registry UI 就是它们。已询问实际位置；Figma 实际发送端也仍待定位，已有接收端 fixture 不能补足这项证据。

已形成以下具体接入事项：

1. 更新正式 UI 版本时，Web 和两个扩展一起核对 Vue 范围及共享实例；扩展自身的 Vue peer 仍声明 ^3.5.0，不能继续暗示新 UI 支持整个范围。
2. graph 的 `@click="zoomIn"`／`zoomOut` 会把 MouseEvent 传给接受 TransitionOptions 的函数，应明确调用 `zoomIn()`／`zoomOut()`。mail 两处 `loading` 应使用公开的 `is-loading`。
3. client-web 的 `uiSourceDedupe` 把全部旧 peer 映射到宿主 node_modules，会覆盖 UI 自己的 JSON 5.6.4；应按新的依赖责任仅共享 Vue／Uno。当前源码联调检查有两项 graph 错误和五项由 JSON 5.7.2 引起的错误。
4. 沿用 [B5 迁移清单](b5-execution.md)：label-sm、旧多参数 apply-font、无效颜色调用、两个搜索提交按钮与 Peer 配置的即时 JSON.parse setter 仍需真实修改。Peer 保存必须保留原始草稿，在校验与确认边界解析，失败不能丢失输入。
5. 消费者 AGENTS 需要声明 UI 文档读取时机；采用 Intent 的项目需配置可信包并确认实际发现。随后验收设置保存、搜索、关系图、Peer 配置和扩展下载等真实页面。

第 2、3 项已准备 [局部接入补丁](l3-evidence/client-web-integration.patch)，通过 `git apply --check`，仅供后续授权后的跨仓变更使用，未应用。它不包含整个 major 迁移，也不冒充消费者完整检查通过。消费者原有未跟踪文件保持不变。

## 验证与交付

最终 `pnpm check` 退出 0，覆盖格式、lint、生成契约、Skill 结构、Story 清单、Token 导入 fixture、类型、构建、独立包契约和 Story 构建；共 21 个 Story、120 个 Variant。随后保留最终独立消费者并完成浏览器复验，关闭 skipLibCheck 的安装检查通过，浏览器无 pageerror，320px 容器无横向页面溢出。

[证据入口](l3-evidence/README.md) 保存最终日志、产物摘要、浏览器结果、生成器失败边界与消费者检查结果。major Changeset 为 [.changeset/tricky-icons-stick.md](../../.changeset/tricky-icons-stick.md)。这些结果只代表本地源码和本地产物，不代表远端 CI、registry 发布、Figma 联调或消费者升级完成。
