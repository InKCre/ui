# 分组方案与验收边界

A、B1—B5、C/D/E 已完成仓库内验证并整理提交，L1 的设计与迁移见 [实施方案](plan-l1-token-system.md) 和 [B5 记录](b5-execution.md)。L3 的 F0—F3、G2 与 G3 本地交付已验证，G1 的外部位置与 G3 的真实迁移仍有未完成项，见 [L3 执行记录](l3-execution.md)；H 的平台实现暂缓。状态、授权与进展统一见 [工作包入口](packet.md)。以下发现保留初审基线，B—E 的最终行为、兼容决定和证据见 [实施记录](execution-b-e.md)。组是责任边界，组内切片才是可独立评审、验证和交付的单位。

## A 开发约定与文档入口

**目标：** 人与 AI 能找到真实命令、当前规则及正确的维护入口，不被历史规划或过时指南误导。

**初审发现：** [根 README](../../README.md) 存在无对应脚本的 `pnpm test`；[包级 AGENTS](../../packages/web/AGENTS.md) 和 [组件 AGENTS](../../packages/web/src/components/AGENTS.md) 仍要求 Vitest 或组件测试，与根约定冲突；组件指南禁止 `unknown`。Token 生成文档使用旧路径，Migration 仍带有历史执行指令。

**范围与切片：** A1 校准 AGENTS、README、组件编写指南和准确命令；A2 清理 Token 生成文档、Migration 中被误当成当前操作的历史信息。只修现有文档与入口，不新增独立文档站，不把任务历史整体重写为新规范。

**验收：** 当前维护步骤指向存在的命令和文件，各层指南不再互相冲突；历史证据和当前指南能清楚区分。源码 API 的准确示例归 F，各组件变更同时维护自己的现有文档。

**依赖与决策：** 可先执行。指南整理由已有仓库规则裁定；如要改变验证政策本身，须作为新的明确决策，不夹带在文字清理中。

**执行结果（2026-09-12）：** A1、A2 已完成，修改范围、基线同步和验证结果见[工作包执行记录](packet.md#l0-执行结果)。原文档中的测试命令、指南冲突、无效路径及历史操作要求已校正；未改变验证政策、组件行为或生成器。

## B Token 与主题契约

**目标：** 设计角色、默认选择与上下文变化可解释，设计依赖在各消费入口按约定生效。原定 B1/B2 已完成的工程目标是库自身样式只引用有效 Token、显式主题选择覆盖系统偏好，以及明确输入格式与生成输出边界；后续 B3/B4/B5 补足设计与响应契约。

**已观察：** 构建 CSS 中有 26 个 `--sys-*` 引用没有库内定义；[AutoForm 样式](../../packages/web/src/components/inkAutoForm/inkAutoForm.scss) 中的 `spacing`、`body-md` 等是实例。另见 [Placeholder](../../packages/web/src/components/inkPlaceholder/inkPlaceholder.scss)、[Textarea](../../packages/web/src/components/inkTextarea/inkTextarea.scss)、[Image](../../packages/web/src/components/inkImage/inkImage.scss)、[DatetimePickerView](../../packages/web/src/components/inkDatetimePickerView/inkDatetimePickerView.scss)。[主题入口](../../packages/web/styles/index.scss) 将显式 dark 放在系统 dark 媒体条件内。

**范围与切片：** B1 对照真实设计语义修复无效引用和主题优先级；B2 在现有生成／产物边界增加 Token 引用完整性证据，写清输入格式、主题、命名及单位约定。修复命名不等于批量增加同义 Token。

**验收：** 库内 Token 引用均有定义，或是明确约定且由消费者提供的扩展值；验证系统 light/dark 与应用 light/dark/system 选择的组合，并检查受影响组件的实际视觉结果。生成结果可重现。

**依赖与决策：** B1 可先执行。尚未确定现有无效名称应映射哪个语义值的地方，需要核对 token 源和设计用途。全量 DTCG 格式迁移和 Dart 输出不属于本组默认范围，相关演进归 H。

### Token 体系复审（2026-09-13，讨论中）

用户指出 L1 的问题超出无效变量和消费契约，要求评议 `web-ui-design-token-system-why-what.md`。最初的 Nextcloud 路径读取被系统拒绝；用户随后提供 `/Users/lanzhijiang/Downloads/web-ui-design-token-system-why-what.md`，现已完整读取。该稿标注为 Why & What 设计方向草案，不预设命名、工具或迁移方案；文件 SHA-256 为 `a8119b3ab7663a0986a97f1b93eca27456a0940ac83c607734f148f0b8ccdba1`。用户已认可下述判断与切片，并要求细化实施方案；具体命名、数值及响应策略仍需按 B3/B4 的步骤确定。

本轮仓库复核支持将设计合理性单独讨论：

- `sys.color.text.primary` 实际用于 InkButton 的 primary 背景之上，与容易被理解为主要正文的名称存在歧义；同组 `danger-on` 则明确表达背景配对。应先定义前景、背景及状态的使用关系，再决定命名。
- 生成器将 ref 的 space、radius、size、font 等整体复制到 sys.$base。这些输出增加了命名空间，却没有独立表达系统决策。是否保留别名应由实际覆盖、兼容或设计变化需求决定。
- 源中存在 primary-hover 和 danger-hover，而 InkButton 对应 hover/active 使用 opacity: 0.9；深色 text.base 与 text.muted 同值。这些是已观察的实现事实，说明状态责任与层级表达需要核对，不能仅凭变量有定义便认定设计成立；同值本身也不自动构成缺陷。
- 按 `type/value` 叶节点统计，源含 237 个条目，均无非空 description。单凭源文件不足以让消费者理解适用背景、状态及替代关系；不据此推断其他文档完全没有说明。

**对草案的判断：** 赞同以设计意图、依赖关系和适用条件作为一致性的对象。草案已经允许固定值、离散尺度、局部 CSS，并明确四种职责不等于四个代码层，因此不能将其解读为动态化全部 Token 或建设通用规则引擎。基础尺度本身也能表达有意选择的视觉节奏，是否升级为响应规则仍需实际场景证明。

诊断需更精确：现有源已经包含语义颜色、字体角色和主题映射；本地 client-web 的 `apps/client-web/src/views/info-base/list/list.scss` 也已使用 clamp 表达页面留白。当前问题包含设计规则缺口，以及已有规则在生成和消费中的不一致，不能简单归结为只存在数值表或缺少流式布局。

补充复核与隔离生成证据：

- [Sass apply-font](../../packages/web/styles/_mixins.scss) 默认只输出字号、字重、行高、字距，而 [Uno 字体规则](../../packages/web/styles/uno/preset-ink.ts) 还输出字体家族和非 none 的装饰。使用现有 Sass 与 UnoCSS 的一次性生成实验确认：同一个 `label-lg-underlined`，Sass 没有 font-family/text-decoration，Uno 有 Inter 和 underline。这里已是可观察的输出差异，不仅是模型讨论。
- 同次实验中 Uno `p-md` 输出 `padding:16px`；组件 Sass 使用 `var(--sys-space-md)`。只有在设计明确支持运行时修改该尺度时，才要求两者共同响应；在决定覆盖能力前，不把全部字面量输出一概判错。
- [Skill seed](../../packages/web/skill.seed.json) 将“硬编码一个已有 Token 值”列为常见错误。这会鼓励按数值相等建立依赖，应在新规则确定后改为按设计角色选择，并说明合法的局部规则。随包指南还需给出默认方案和少量允许的变化，避免让每个消费者 Agent 自行推导设计系数。

建议在草案原则之上明确三个落地条件：设计系统提供可直接使用的默认选择；公开覆盖能力注明作用域、优先级及求值时机；新增响应机制以实际内容、容器和用户设置下的改善为依据。跨平台共享语义角色和行为要求，具体 CSS 表达式由 Web 拥有，不能直接承诺其等同 Flutter 或 uniapp 的实现。

用户已认可后续切片如下；[实施方案](plan-l1-token-system.md) 进一步定义其步骤、交付物、文件责任和验收，该表保留切片定义，当前执行结果见表后的 B3／B4／B5 记录：

| 切片 | 交付与范围 | 验收依据 |
| ---- | ---------- | -------- |
| B3 设计角色与响应契约 | 分别明确 typography、spacing、color 的默认选择、相关上下文、允许变化、边界和责任；包括字体继承、前景背景配对及控件状态。 | 能解释哪些属性应一起变化，哪些应保持；固定值与响应行为都有实际用途。 |
| B4 代表场景验证 | 用现有 Input/Field/Form 验证文字与控件尺寸，用 Button 验证颜色和状态，用真实下游页面验证容器与留白。先做最小实验，不新增 Card 等组件作为前提。 | 窄容器、长中文/英文、文字放大、浅深主题、错误及禁用状态下内容与功能可用，视觉结果经过人工判断。 |
| B5 源结构、输出与迁移 | 根据 B3/B4 的已确定规则调整 Token 源、Sass/Uno 输出、文档、Skill 与消费迁移；先明确构建时配置和运行时覆盖分别支持什么。 | 同一公开角色在各入口兑现相同契约，必要依赖按预期传播，发布兼容边界清楚。 |

这些切片替代上一轮暂定的 B3/B4 划分。原定 B1/B2 保留工程修复和验证结果，不能代表上述设计工作完成。F 继续拥有通用 API 提取机制，B5 拥有本轮设计消费说明；H 继续由真实消费者触发非 Web 输出，跨平台可共享的语义不因此推迟到 H。

**B3 执行结果：** 用户要求“开始 B3”后，已完成 B3.1—B3.3。最新角色、默认候选、维护／覆盖责任和 B4 实验编号由 [B3 候选契约](b3-design-contracts.md) 统一记录，实际调用与计算证据见 [盘点清单](b3-role-inventory.md)。本节保留此前评议；它不替代已收敛的 B3 交付，也不能被理解为 B4 的视觉验证已经完成。

**B4 执行结果：** 用户授权“做 b4”后，已完成所有编号实验的裁决。已选规则、修订原因与实际证据由 [B4 场景验证](b4-validation.md) 统一记录；当时正式实现尚未迁移，后续结果见 B5。保留静态基础尺度，新增文本角色有场景依据，修订文字控件几何、Switch 状态尺寸占位、合法颜色配对及默认消费指南。

草案中的关键技术边界已对照一手资料核实：[DTCG 2025.10](https://www.designtokens.org/tr/2025.10/format/) 的命名值、引用与复合值，[CSS Values](https://www.w3.org/TR/css-values-4/#font-relative-lengths) 的相对单位及 clamp 规则，[容器单位](https://www.w3.org/TR/css-conditional-5/#container-lengths) 的祖先依赖及小视口回退，以及 [文本缩放](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)、[颜色混合](https://www.w3.org/TR/css-color-5/#color-mix) 与 [对比度](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) 的不同职责。没有依据将公式或特定 CSS 单位视为视觉或可访问性通过证明。本轮只做阅读、只读调查、隔离生成和工作包编辑，没有修改生产源码、外部草案或消费者。

**B5 执行结果：** 仓库内已验证，详见 [实施记录](b5-execution.md)。源、生成器、组件、Story、Skill、迁移说明和 major Changeset 已完成，完整检查及默认产物消费通过。用户要求停止 Firefox 原生文字放大专项，后续不以极端场景扩展适配。真实发送端与消费者联调证据仍归 G。

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

**目标：** 消费者 Agent 和工程师通过已安装包找到完整、准确、足够精简的设计判断、API 与组合方法；维护 Agent 从仓库入口读取共同设计规则，能够解释和维护这些承诺。

**已确认并实施（2026-09-13）：** 用户确认共同 DESIGN.md 的定位及 F/G 切片并授权 L3。根级源、随包副本、API 事实与可检查配方已经交付；设计论证保留在 [L3 方案](plan-l3-design-docs.md)，当前结果见 [执行记录](l3-execution.md)。

**已有基础：** B—E/B5 已校正组件选型和行为说明，包含 DoubleCheck 的实际弹层语义；补充默认表单、文本角色、主题覆盖、迁移指南及一份完整保存配方。随包 Skill 的分层结构与 Intent 本地打包发现检查继续保留。

**实施前缺口：** [Skill 生成器](../../scripts/build-agent-skills.ts) 的 API 事实主要从 `*Props`／`*Emits` 提取，尚未纳入 Vue `defineModel`。[Popup 参考](../../packages/web/skills/ui-web/references/components/InkPopup.md) 已在人工 caveat 说明 `v-model:open`，但生成的事实部分仍遗漏 open。类型、默认值、载荷和插槽参数也未形成完整事实；配方虽已有默认表单，尚未建立与类型检查对应的代表示例机制。

**范围与切片：** F0 先确认并整理共同设计指南、既有说明责任与维护读取入口；F1 补齐 API 事实提取及解析失败边界；F2 复用 Story 中可类型检查的示例，按真实任务提供少量完整的表单、反馈、主题、router 和 i18n 配方；F3 与 G3 一起核对 DESIGN.md 的同源随包交付、Markdown 入口、包内链接与 Intent 发现／信任路径。正式设计规则的归属按 F0 确认结果调整；不手工维护两份 API。

**验收：** 两类 Agent 能找到共同设计规则并判断默认选择和扩展责任；从安装产物中能读到实际模型、必需类型、事件载荷和插槽参数；选型描述符合实现；代表性用例只用公开导出即可检查和构建；无需访问生产者源码仓库才能完成普通消费任务。

**依赖与决策：** F1 的 API 事实不依赖 F0 正文定稿，F2 依据 C/D/E 已确定的契约和 G1 的真实任务选取。涉及提取器改造时优先利用已有编译工具能力，不继续无界扩充手写语法解析器。消费者发现与启用证据由 G 收集；不新增 MCP 或 AI 文档服务。

**执行结果：** F0—F3 已验证。Vue 官方元数据与受限默认值适配器生成完整 API；三份 Story 配方从安装包 Markdown 提取后编译，并完成保存失败、原始 JSON、主题／语言／路由旅程。DESIGN.md 同源检查、包内链接与独立 Intent 加载通过。维护者长标签演练保留已有角色和内容增长规则，不新增全局密度或文本角色。局限与证据见 [L3 记录](l3-execution.md)。

## G Package 工程验证与下游接入

**目标：** 安装产物、类型、运行时依赖和真实调用一致，以适量检查证明消费者能够使用。

**进入 L3 时的基础：** Vue 支持范围已收紧到 ^3.5.0；B—E/B5 已验证公开导出、生成声明、Token 引用、Sass/Uno 与本地 tarball 消费，并给出 major Changeset 和已知 client-web 调用的迁移步骤。

**实施前缺口：** [包声明](../../packages/web/package.json) 将多项专用编辑依赖列为 peer；[包契约 fixture](../../scripts/check-package-contract.ts) 仍依靠本地完整依赖图且使用 `skipLibCheck`，不能作为独立最小安装证明。总检查重复执行部分 Skill 和类型工作，还保留改名后的旧包身份复检，需要根据现行消费责任判断是否保留。client-web 的版本升级、Skill 使用与关键页面尚未完成真实验收；extension registry 的 UI 消费位置尚未确认。

**范围与切片：** G1 盘点 client-web 与 extension registry 的实际入口、版本、Skill 使用和关键页面；G2 校准依赖责任、支持版本与发布类型；G3 改进最小安装／公开入口／真实消费检查，并删除没有现行责任的重复步骤。保持源码联调作为开发便利，不替代产物证明。

**验收：** 消费者位置和影响范围有证据；符合声明的安装图可解析公开 API；包内声明在约定环境可用；受影响的实际页面完成验证。若发布已获授权，补精确版本安装证据；否则明确区分“本地已验证”和“已发布／已升级”。

**依赖与决策：** G1 应尽早调查，贯穿全部组件切片。基础控件与 JSON 编辑器是否分子入口、哪些包必须共享为 peer、旧包身份检查是否仍有价值，依据实际消费图决定，不预设拆 package 或升级工具链。跨仓实现按用户后续授权范围执行。

B5 接收端已实现受限 Figma 值更新，但没有真实发送端代码／payload；G 的实际联调须补齐这项证据。B5 已记录 client-web 的 Token 调用迁移映射，生产者通过不代表消费者完成升级。

**执行结果：** G2 与 G3 本地交付已验证。内部依赖由包安装，Vue 下限按实际声明收紧至 3.5.25；最小消费者独立安装、关闭 skipLibCheck，验证指南代码、公开入口与可选 Uno。G1 已核对 Web、mail、twitter，实际 Web 源文件仍有两项 graph 回调错误；旧源码联调配置另有依赖覆盖问题。消费者迁移和页面验收尚未完成，extension registry 独立 UI／Figma 发送端尚缺位置。具体调用、局部未应用补丁与剩余事项统一见 [L3 接入记录](l3-execution.md#真实消费者与接入事项)。

## H 多端契约与扩展时机

**目标：** 让 Web 之外的实现能够复用设计语义，同时各平台拥有自己的交互与运行时边界。

**已观察：** [Token 源](../../tokens/inkcre.tokens.json) 使用 `type/value` 与 `custom-shadow`，不能直接等同标准 DTCG 格式。[生成器](../../scripts/build-tokens.ts) 包含 Web/Sass 专用规则；初审发现的 alpha 剥离转换已在 B5 移除，并验证半透明颜色和阴影输出。现有组件依赖 DOM、Teleport、CodeMirror，不能推定能够用于 uniapp 所有运行端。

**本轮范围：** H1 明确哪些语义跨平台共享，记录输入格式、单位、颜色透明度、主题与名称兼容的演进原则；H2 仅在首个 Flutter 或具体 uniapp 运行端项目进入交付时启动对应 Token 输出与最小消费验证。

**验收：** 当前对外声明不作未经验证的跨端承诺；非 Web 开始实施时，有具体消费者、运行端、交付物和验证方式。仅定义原则可完成 H1，不能据此宣称 Flutter／uniapp 已支持。

**依赖与决策：** 复用 B 的设计语义和 G 的交付经验。平台目标、DTCG 迁移必要性及输出方式尚未决定。默认不建立空平台 package、跨端 UI 抽象、配置插件系统或统一 renderer。

## 推荐推进方式

A 已提交；B1—B5 与 C/D/E 已完成仓库内验证，实现整理为 b9c0bc6。L3 的仓库实现和本地交付已验证；接下来需定位尚未确认的消费者／Figma 发送端，并在获得相应授权与发布条件后完成真实升级和页面验收。具体清单见 [L3 执行记录](l3-execution.md)，不重做已经通过的本库基础工作。

C 的基础交互规则支撑 D，D3 的日期契约支撑 E2 的日期映射；E1 支撑 E2/E3 的校验隔离。它们是局部依赖，不要求前一组全部完成才修后一组的独立缺陷。F 随各切片更新消费说明，G 随各切片证明打包与下游兼容。H2 暂缓，不作为当前 Web 修复的前置条件。
