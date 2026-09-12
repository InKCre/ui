# 分组方案与验收边界

A 组已完成并验证，其余分组仍是待讨论提案。状态、授权与进展统一见 [工作包入口](packet.md)。以下“建议行为”不代表现有实现已经满足，也不代表兼容性取舍已经批准。组是责任边界，组内切片才是可独立评审、验证和交付的单位。

## A 开发约定与文档入口

**目标：** 人与 AI 能找到真实命令、当前规则及正确的维护入口，不被历史规划或过时指南误导。

**初审发现：** [根 README](../../README.md) 存在无对应脚本的 `pnpm test`；[包级 AGENTS](../../packages/web/AGENTS.md) 和 [组件 AGENTS](../../packages/web/src/components/AGENTS.md) 仍要求 Vitest 或组件测试，与根约定冲突；组件指南禁止 `unknown`。Token 生成文档使用旧路径，Migration 仍带有历史执行指令。

**范围与切片：** A1 校准 AGENTS、README、组件编写指南和准确命令；A2 清理 Token 生成文档、Migration 中被误当成当前操作的历史信息。只修现有文档与入口，不新增独立文档站，不把任务历史整体重写为新规范。

**验收：** 当前维护步骤指向存在的命令和文件，各层指南不再互相冲突；历史证据和当前指南能清楚区分。源码 API 的准确示例归 F，各组件变更同时维护自己的现有文档。

**依赖与决策：** 可先执行。指南整理由已有仓库规则裁定；如要改变验证政策本身，须作为新的明确决策，不夹带在文字清理中。

**执行结果（2026-09-12）：** A1、A2 已完成，修改范围、基线同步和验证结果见[工作包执行记录](packet.md#l0-执行结果)。原文档中的测试命令、指南冲突、无效路径及历史操作要求已校正；未改变验证政策、组件行为或生成器。

## B Token 与主题契约

**目标：** 库自身样式只引用有效 Token，显式主题选择能够覆盖系统偏好，输入格式与生成输出有清楚边界。

**已观察：** 构建 CSS 中有 26 个 `--sys-*` 引用没有库内定义；[AutoForm 样式](../../packages/web/src/components/inkAutoForm/inkAutoForm.scss) 中的 `spacing`、`body-md` 等是实例。另见 [Placeholder](../../packages/web/src/components/inkPlaceholder/inkPlaceholder.scss)、[Textarea](../../packages/web/src/components/inkTextarea/inkTextarea.scss)、[Image](../../packages/web/src/components/inkImage/inkImage.scss)、[DatetimePickerView](../../packages/web/src/components/inkDatetimePickerView/inkDatetimePickerView.scss)。[主题入口](../../packages/web/styles/index.scss) 将显式 dark 放在系统 dark 媒体条件内。

**范围与切片：** B1 对照真实设计语义修复无效引用和主题优先级；B2 在现有生成／产物边界增加 Token 引用完整性证据，写清输入格式、主题、命名及单位约定。修复命名不等于批量增加同义 Token。

**验收：** 库内 Token 引用均有定义，或是明确约定且由消费者提供的扩展值；验证系统 light/dark 与应用 light/dark/system 选择的组合，并检查受影响组件的实际视觉结果。生成结果可重现。

**依赖与决策：** B1 可先执行。尚未确定现有无效名称应映射哪个语义值的地方，需要核对 token 源和设计用途。全量 DTCG 格式迁移和 Dart 输出不属于本组默认范围，相关演进归 H。

## C 基础控件与表单上下文

**目标：** 基础控件遵循可预期的原生行为，字段信息可被辅助技术识别，状态和事件能被消费者可靠控制。

**已观察：** [Button](../../packages/web/src/components/inkButton/inkButton.vue)、[Switch](../../packages/web/src/components/inkSwitch/inkSwitch.vue)、[Pagination](../../packages/web/src/components/inkPagination/inkPagination.vue) 未显式设置原生按钮 type；Button 的 `type` 已表示外形。[Field](../../packages/web/src/components/inkField/inkField.vue) 使用 span 标签，[Input](../../packages/web/src/components/inkInput/inkInput.vue) 和 [Textarea](../../packages/web/src/components/inkTextarea/inkTextarea.vue) 缺少标签、原生约束与错误关联。[Form](../../packages/web/src/components/inkForm/inkForm.vue) 提供的是初始 `computed.value` 对象。两套 optional-model helper 语义不同，分别位于 [composables](../../packages/web/src/composables/use-optional-model.ts) 和 [utils](../../packages/web/src/utils/vue-props.ts)。

**下游证据：** 本地 client-web 的 `apps/client-web/src/components/peer/peerCard/peerCard.vue` 监听 Input 的 `confirm`，而生产者当前只发出 `update:modelValue`。需核对持久化流程，不能仅将监听器删除后视为完成。

**范围与切片：** C1 普通动作与提交、disabled/pending、click 事件边界；C2 字段关联、属性透传、Form 上下文响应性和内联编辑事件；C3 Dropdown 的键盘打开／选择／关闭，以及 Switch、Pagination、Tooltip、Header、Image、Loading 的基础交互与可访问语义。只在既有 helper 调用规则明确后消除重复，不强制全部组件切换到一种代码写法。

**验收：** 普通按钮和开关不误提交；显式提交仍可用；控件能被标签定位，键盘可操作，受控更新和布局更新符合契约；确认内联编辑实际触发了消费者要求的保存行为。按真实旅程验收，不建立逐 props/emits 断言套件。

**依赖与决策：** C1 必须盘点依赖默认提交的调用；C2 需选择内联编辑的提交事件与取消行为。外部消费者修改由 G 协调。B 的样式修复可独立进行，但组件视觉验收应使用修正后的 Token。

## D 浮层、确认与日期交互

**目标：** 模态／非模态的责任、焦点生命周期、确认取消以及异步状态明确，不让每个消费者重复修补。

**已观察：** [Dialog](../../packages/web/src/components/inkDialog/inkDialog.vue) 和 [Popup](../../packages/web/src/components/inkPopup/inkPopup.vue) 没有完整的标准模态键盘与焦点行为。Dialog 的 Promise 模型没有阻止旧结果覆盖较新状态，watcher 调用处未接住拒绝。[Picker](../../packages/web/src/components/inkPicker/inkPicker.vue) 每次选择立即更新模型，Cancel 和 Confirm 都只关闭；日期字符串会导致渲染异常。[DoubleCheck](../../packages/web/src/components/inkDoubleCheck/inkDoubleCheck.vue) 实际是确认弹层，不是文档所描述的简单二次点击控件。

**范围与切片：** D1 明确 Dialog、Popup、Scrim、DoubleCheck 的责任，补标准模态与保留 modeless 行为；D2 明确异步操作期间的关闭、取消、失败与重复操作语义；D3 明确 Picker 的草稿／提交、空值、Date 输入和日期视图边界。Image 的浮层交互随 D1 核对，基础触发语义归 C。

**验收：** 焦点进入、约束、恢复及 Escape 符合所选模式，modeless 不意外限制背景操作；取消不产生用户未确认的提交，异步旧结果不覆盖较新状态；日期选择和外部值更新符合确定的输入契约。

**依赖与决策：** 复用 C 的按钮和状态契约，不引入第二套。布尔模型加显式 pending、保留或迁移 Promise 模型、原生 dialog 或现有实现增强，均需在具体切片中比较兼容影响后决定。标准交互优先由库负责；不默认建立通用 overlay manager。

## E Schema 表单与 JSON 编辑

**目标：** 保护已有用户数据，让校验、编辑和持久化之间的信息完整，多实例互不污染。

**已复现：** [AutoForm](../../packages/web/src/components/inkAutoForm/inkAutoForm.vue) 初始化时 schema 默认值优先于已有值；数字输入成为字符串，0 的显示还受 `|| ''` 影响；日期字符串直接传给 Date Picker。其 [校验函数](../../packages/web/src/components/inkAutoForm/inkAutoForm.ts) 将类型错误归入未显示的 root，服务异常返回有效。[共享 schema service](../../packages/web/src/components/inkJsonEditor/jsonSchemaService.ts) 配置会被另一个实例覆盖。

**源码风险：** [JsonEditor](../../packages/web/src/components/inkJsonEditor/inkJsonEditor.vue) 只在 JSON 语法有效时更新模型，用户输入无效文本时父级保留旧值。是否造成实际误保存要在消费者保存旅程确认，不能将风险描述为已观察的数据丢失。

**范围与切片：** E1 schema 服务与文档身份的实例隔离；E2 AutoForm 的已有值优先、primitive 转换、schema 变化和错误展示；E3 JsonEditor 的编辑文本、有效结果、校验状态与外部更新契约。检查现有异步校验顺序是否允许旧结果覆盖新输入。

**验收：** 两个不同 schema 的编辑器／表单并存时互不影响；已有值、0、false 不被默认值和字符串转换丢失；数字和日期按公开契约处理；错误和校验不可用可见；保存操作不会把未完成输入悄悄当作旧有效值。

**依赖与决策：** E1 可独立优先执行。E2 日期边界依赖 D3，基础字段语义复用 C，但这不应阻塞默认值覆盖、错误展示等独立修复。E3 的模型是否承载原始文本是公开 API 决策，需要核对下游。默认只兑现现有扁平 primitive schema，不增加嵌套或条件表单框架。

## F AI 消费文档与示例

**目标：** Agent 和工程师通过已安装包就能找到完整、准确、足够精简的 API 与组合方法。

**已观察：** [Skill 生成器](../../scripts/build-agent-skills.ts) 只提取 `*Props`／`*Emits`，没有纳入 Vue `defineModel`；[Popup 参考](../../packages/web/skills/ui-web/references/components/InkPopup.md) 因而漏掉 open 模型。参考主要列名称，缺少类型、默认值、载荷、插槽参数与完整用例。DoubleCheck 的 Skill 选型描述与真实弹层行为不同。现有随包分层读取结构可以保留。

**范围与切片：** F1 补齐 API 事实提取及解析失败边界；F2 复用 Story 中可类型检查的示例，提供少量完整的表单、反馈、主题、router 和 i18n 配方；F3 核对随包 Markdown 的可读入口与 Intent 发现／信任路径。组件行为的长期说明继续放在既有权威文档，避免手工维护两份 API。

**验收：** 从安装产物中能读到实际模型、必需类型、事件载荷和插槽参数；选型描述符合实现；代表性用例只用公开导出即可检查和构建；无需访问生产者源码仓库才能完成普通消费任务。

**依赖与决策：** F1 可先做，F2 随 C/D/E 已确定的契约逐组更新。涉及提取器改造时优先利用已有编译工具能力，不继续无界扩充手写语法解析器。消费者发现与启用证据由 G 收集；不新增 MCP 或 AI 文档服务。

## G Package 工程验证与下游接入

**目标：** 安装产物、类型、运行时依赖和真实调用一致，以适量检查证明消费者能够使用。

**已观察：** [包声明](../../packages/web/package.json) 将多项专用编辑依赖列为 peer，Vue 范围宽于实际 VueUse 要求。[包契约 fixture](../../scripts/check-package-contract.ts) 链接开发环境的全部依赖，并使用 `skipLibCheck`。总检查重复执行部分 Skill 和类型工作，还将当前产物改名为旧包身份复检。已检查的 client-web manifests 中没有发现指南所要求的 `intent.skills`；其他消费入口仍需核实。

**范围与切片：** G1 盘点 client-web 与 extension registry 的实际入口、版本、Skill 使用和关键页面；G2 校准依赖责任、支持版本与发布类型；G3 改进最小安装／公开入口／真实消费检查，并删除没有现行责任的重复步骤。保持源码联调作为开发便利，不替代产物证明。

**验收：** 消费者位置和影响范围有证据；符合声明的安装图可解析公开 API；包内声明在约定环境可用；受影响的实际页面完成验证。若发布已获授权，补精确版本安装证据；否则明确区分“本地已验证”和“已发布／已升级”。

**依赖与决策：** G1 应尽早调查，贯穿全部组件切片。基础控件与 JSON 编辑器是否分子入口、哪些包必须共享为 peer、旧包身份检查是否仍有价值，依据实际消费图决定，不预设拆 package 或升级工具链。跨仓实现按用户后续授权范围执行。

## H 多端契约与扩展时机

**目标：** 让 Web 之外的实现能够复用设计语义，同时各平台拥有自己的交互与运行时边界。

**已观察：** [Token 源](../../tokens/inkcre.tokens.json) 使用 `type/value` 与 `custom-shadow`，不能直接等同标准 DTCG 格式。[生成器](../../scripts/build-tokens.ts) 包含 Web/Sass 专用规则和剥离色值 alpha 的转换；当前扫描未发现受该转换损坏的非不透明 color token，不将其描述为已发生的视觉缺陷。现有组件依赖 DOM、Teleport、CodeMirror，不能推定能够用于 uniapp 所有运行端。

**本轮范围：** H1 明确哪些语义跨平台共享，记录输入格式、单位、颜色透明度、主题与名称兼容的演进原则；H2 仅在首个 Flutter 或具体 uniapp 运行端项目进入交付时启动对应 Token 输出与最小消费验证。

**验收：** 当前对外声明不作未经验证的跨端承诺；非 Web 开始实施时，有具体消费者、运行端、交付物和验证方式。仅定义原则可完成 H1，不能据此宣称 Flutter／uniapp 已支持。

**依赖与决策：** 复用 B 的设计语义和 G 的交付经验。平台目标、DTCG 迁移必要性及输出方式尚未决定。默认不建立空平台 package、跨端 UI 抽象、配置插件系统或统一 renderer。

## 推荐推进方式

A 已完成；下一步可展开 B 的具体切片。每次只展开即将执行的切片，避免一次设计完所有组件。E1 可以因数据正确性提前处理，G1 的消费调查应尽早开展。

C 的基础交互规则支撑 D，D3 的日期契约支撑 E2 的日期映射；E1 支撑 E2/E3 的校验隔离。它们是局部依赖，不要求前一组全部完成才修后一组的独立缺陷。F 随各切片更新消费说明，G 随各切片证明打包与下游兼容。H2 暂缓，不作为当前 Web 修复的前置条件。
