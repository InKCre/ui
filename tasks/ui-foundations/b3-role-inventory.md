# B3 角色盘点与处理清单

本文件记录 2026-09-13 的实际输入、引用和处理结论；拟定行为见 [B3 候选契约](b3-design-contracts.md)。当前事实不等于目标规范，候选值也不代表已经更新生产源。

## 基线与覆盖范围

生产者 HEAD 为 `c5b230af2461d401fa9dc3ac8d5b356c20b89c46`，分支为 `feat/ui-foundations-components`，包含此前未提交的 B1/B2、C、D、E 改动。Token 源 SHA-256 为 `49bdab143e095749f1ff8e4d6265de111af8ab91432ba49f7225144eb698507f`；生成器为 `117c037b0a0b90341198f75dac0c006ac7f416a9d776219ca547774223490bda`。B3 开始时记录了 234 个工作包之外的非忽略文件哈希，用于结束时确认没有改动生产文件。

盘点覆盖 [manifest](../../packages/web/component-manifest.json) 的全部 21 个组件及其样式、源码中的内联样式与工具类、Sass/Uno 生成入口和随包指南。消费者只读检查本地 `../client-web/apps/client-web`：其仓库 HEAD 为 `367ace98bfb7e9880c002e7971eb397a25c9ef84`，package 声明为 `@inkcre/ui-web@1.4.0`。这里检查的是 checkout 中的调用对本次生产者源码的需求，未重新安装其锁定发布包，不能断言线上产物存在同样缺陷。extension registry 的实际消费位置仍未核实，交给 G 继续定位。

源共有 237 个 `type/value` 叶节点：ref 69、sys 38、comp 6、effect 3、typography 121；后者组成 11 个字体样式。所有叶节点均没有非空 description。静态扫描发现组件代码使用 5 种现有基础字体角色（另有 mono 参数），下游还请求 3 种未定义角色。数量不包含对生成物和 Story 的重复计数，字符串扫描后已人工核对下面的代表调用。

## 字体角色

数值为源中的字号／行高，单位按当前生成器输出为 px；普通样式字重为 400。这里的名称是现有名称。用在标签上的 `label-*` 与用于段落的 `body-*` 即使最终采用相同值，也保留不同的用途。

| 当前角色 | 源默认与字体 | 实际用途／代表调用 | 处理结论 |
| --- | --- | --- | --- |
| label-lg | 14/16，Inter | Button md、Input、Dropdown、Picker、Textarea、Tooltip、JsonEditor；client-web 扩展 ID | 保留控件／短标签角色；统一字体来源，将行高 20 作为 B4 候选。 |
| label-md | 12/16，Inter | Button sm、Field col 标签、Dropdown 说明、Pagination；下游状态和日期 | 保留紧凑标签角色；多行说明不因此都使用 12px，迁往实际正文／辅助文本角色。 |
| label-sm | 10/14，Roboto，700，字距 0.7 | Dropdown loading/empty、必填星号、Switch；下游日期、块类型 | 从普通内容的推荐集合中移出；有效信息优先试 label-md，保留旧入口的迁移记录，不能直接删除所有调用。 |
| label-lg-underlined | 14/16，Inter，underline | 在已检查生产代码未发现调用；现有公开 Uno 与 Sass 支持不一致 | 合并为 label-lg 加显式装饰；若保留旧入口，必须完整兑现 underline，不能只返回字号。 |
| label-lg-mono | 14/16，JetBrains Mono | 直接名称未见调用；下游多处实际调用 `apply-font(label-lg, mono)` | 合并为 label-lg 加 mono 选择，统一两种路径；保留旧名称迁移。 |
| label-sm-mono | 10/14，JetBrains Mono，700，字距 0.4 | 直接名称未见调用；Switch 与下游日志／ID 使用第二参数 mono 或 true | 与 label-sm 一起处理；普通代码／ID 不默认采用 10px。 |
| title-sm | 22/28，Inter | Dialog、Header、Image、Placeholder；下游配置弹层标题 | 保留小标题角色及初始数值。 |
| title-sm-mono | 22/28，IBM Plex Mono，字距 0.66 | Header 使用 `apply-font(title-sm, mono)`，实际取 ref 的 mono 栈，并未使用这个字体记录 | 合并为 title-sm 加 mono；无需另建一个字号相同但家族隐含变化的标题角色。 |
| body-lg | 18/24，Inter | Dialog 副标题、Placeholder 说明、DoubleCheck 标题；下游搜索输入／空态 | 保留较突出正文角色；是否该处应使用普通正文须按用途迁移。 |
| body-lg-mono | 18/24，JetBrains Mono | 已检查的直接调用中未发现使用 | 归为 body-lg 加 mono，不能仅因未使用就静默删除公开入口。 |
| headline-lg | 36/48，Inter | client-web info-base/list 页面标题 | 保留醒目页面标题角色，窄容器先换行／调整布局。 |
| body-md（缺失） | 无 | client-web 的 LogsViewer 空态／错误、RecallSearch 输入等共 6 个 helper 调用 | 新增普通正文候选，16/24；其中输入用途要先判断是否应使用控件标签。 |
| body-sm（缺失） | 无 | extensionCard 名称／提示／错误等共 6 个 helper 调用 | 新增辅助正文候选，14/20；避免替换为行高紧凑的标签样式。 |
| title-lg（缺失） | 无 | peerList 页面标题 | 新增页面小标题候选，28/36，与已有 22 和 36 两种用途比较。 |

另有 settings 的 `apply-font('title', 'lg')`。现有第二参数是 mono 开关，并非字号；此调用既引用不存在的 `title` 角色，还会因 Sass 非空字符串为真而进入 mono 分支。它属于迁移时须显式纠正的调用，不能通过增加一个无明确用途的 `title` Token 掩盖。

[apply-font](../../packages/web/styles/_mixins.scss) 默认不输出 font-family/text-decoration；[Uno 字体规则](../../packages/web/styles/uno/preset-ink.ts) 输出家族与非 none 的装饰，并省略零字距重置。因此差异还涉及嵌套后的继承，不能只比较默认截图。Textarea 和 JsonEditor 另硬编码 Monaco/Courier New；`ref.typo.family.sans` 为 system-ui 栈，`mono` 为 SF Mono/Monaco/Roboto Mono 栈，角色记录则出现 Inter、Roboto、JetBrains Mono、IBM Plex Mono。应先确定统一职责，再决定保留哪些字体选择。

## 颜色角色与合法配对

以下颜色移除了源中的不透明 alpha 后展示。默认对是浅色／深色；使用位置是实际样式声明，不是浏览器已渲染证据。

| 当前 sys.color 角色 | 默认浅／深 | 使用与处理结论 |
| --- | --- | --- |
| text.base | #070707 / #f9f9f9 | 普通文本；保留，默认配中性普通表面。 |
| text.subtle | #5e5e5e / #c6c6c6 | 标签、说明、Dialog 副标题；保留次要前景，禁止自动用于反色动作表面。 |
| text.muted | #919191 / #f9f9f9 | 下游小字号说明、eyebrow、设置通知；合并到可读的次要前景，不将 muted 当成可降低对比度的豁免。 |
| text.primary | #fbfcff / #0b1220 | Button primary、Pagination selected、Dropdown selected；澄清为 on-primary。DoubleCheck 普通表面标题是错误配对，应使用 text.base。 |
| text.danger-on | #fff8f7 / #fff8f7 | danger 按钮前景；保留用途，统一命名为 on-danger。 |
| surface.base | #ffffff / #474747 | 页面、Popup、Tooltip、输入、列表；保留普通工作表面，不宣称它代表所有平台的同一海拔。 |
| surface.subtle | #f9f9f9 / #1f1f1f | Header、subtle 按钮、只读区域、反馈背景；保留分组／内嵌表面。 |
| surface.muted | #e2e2e2 / #131313 | 已检查生产调用未见直接使用；保留兼容记录，不给新内容推荐第三种用途，也不自动删除。 |
| surface.primary | #121928 / #c8cee3 | 强调动作、选中项；保留，与 on-primary 共同维护。 |
| surface.primary-hover | #474e5f / #9198ac | Dropdown 已使用，Button 使用整体透明度；保留候选状态配对，统一状态责任。 |
| surface.danger | #a80324 / #b9192f | 危险动作背景；保留，与 on-danger 配对。 |
| surface.danger-hover | #ff7073 / #b9192f | Button 未使用这个值；浅色值无法承载当前 on-danger 普通文字，重选状态值。 |
| surface.base-hover | #eeeeee / #474747 | Dropdown hover；保留状态角色，深色等于默认值，需要在 B4 检查状态线索。 |
| surface.subtle-hover | #eeeeee / #5e5e5e | subtle Button、Pagination；保留状态角色及初始值，检查与前景的配对。 |
| border.base | #303030 / #5e5e5e | 控件与容器边界；明确为需辨认的控件边界，与装饰分隔线分开。 |
| border.strong | #070707 / #c6c6c6 | Picker active、Textarea focus 声明；保留强调／焦点候选，不因 Token 有值就认定焦点可见。 |
| border.subtle | #c6c6c6 / #5e5e5e | Input/Dropdown 等当前用于必要边界；明确为装饰分隔用途，必要边界迁往 control/base 规则。 |
| border.muted | #919191 / #5e5e5e | 下游侧栏、日志和来源内容分隔；归并装饰分隔，不增设第三种控制边界。 |
| feedback.error | #b9192f / #ff525c | AutoForm、Field、Placeholder；保留错误前景角色，深色普通表面上的数值需要调整。 |

组件级 `comp.switch.track-bg/handle-bg/label-color` 在浅色为 #070707/#f9f9f9/#070707，深色反转；用途是 Switch 的单色结构，保留三个组件角色，不强制经过与其用途不符的 surface.primary。开关状态主要由位置与文字表达。Image 标题直接使用 neutral.98，Scrim 和 Popup 遮罩直接使用 rgba(0,0,0,.5)，应明确前景／遮罩配对；Loading 的 neutral.70/80 与脉冲透明度属于状态图形，不能将其当成普通文本层级。

下游已存在但当前源没有的需求：

| 请求 | 实际用途 | B3 处理 |
| --- | --- | --- |
| color.success.base、warning.base、info.base | JobCard 和任务详情的完成／等待／运行文字，peerCard 连通状态 | 新增 feedback.success/warning/info 的主题前景候选，状态还必须有文字或图形含义；不为三个角色建立完整色阶。 |
| color.danger.base | 错误文字、错误边界 | 映射到反馈错误；需要危险动作背景时另选 action/surface，不能都叫 danger.base。 |
| color.success.surface、danger.surface、danger.light | peerCard 状态与 LogsViewer 错误背景 | 首选 surface.subtle 加相应反馈前景；是否确需有色容器由 B4 状态场景判断，不批量补齐所有状态的表面矩阵。 |
| color.border.primary | 焦点、选中节点与连线 | 分别归入焦点／选中规则；它们可能共享初始色，但不能混为主品牌边框。 |
| color.surface.hover | JobCard 行悬停 | 依据实际普通表面选 base-hover，不新增同义角色。 |

client-web 源中未发现补充这些变量的自定义属性声明；其 Uno 配置也未使用 presetInk。这里确定的是源码需求与当前源的缺口，消费者正式安装状态归 G 验证。

## 空间、尺寸及其余基础值

| 当前族／全部范围 | 代表使用与实际职责 | 处理结论与默认边界 |
| --- | --- | --- |
| space xs/sm/md/lg/xl = 4/8/16/32/56 | Field 标签间距、Form 组间距、Button 内边距、页面留白均复用 | 保留作为有意选择的基础尺度；跟随文字的局部关系与页面容器规则单独表达，不按数值相等推导联动。 |
| size xs/sm/md/lg/xl = 18/24/36/48/58 | Switch 高度、方按钮、分页、Dropdown/Picker | 保留兼容尺度，澄清控件最小尺寸与固定几何；普通输入固定 36px 是组件当前选择，不能与所有 size.md 调整隐式绑定。 |
| size.icon sm/md/lg = 20/24/36 | Pagination 点击区域、居中图标盒；Uno iconsize 类直接设置宽高 | 澄清图形盒／点击区域；不能默认等同 glyph。 |
| size.iconfont sm/md/lg = 8/12/18 | apply-icon 设置 font-size，间接影响 1em 的 mask 图形 | 保留为比较基线；B4 比较固定 glyph 和跟随文字的 1em，点击目标独立保障。 |
| radius none/xs/sm/md/lg/full = 0/4/8/16/32/999 | 分页／Tooltip 方角、AutoForm 反馈、下游容器 | 保留，大小不需要跟随字体自动变化；full 表示全圆意图，不将 999 当成跨平台固定半径。 |
| effect.elevation.raised low/md/high | 低／中／高阴影，当前 Tooltip 用 md | 保留阴影作为整体设计效果及其 alpha；下游 `shadow.lg` 应按浮层用途选择 apply-elevation，不能仅因 lg 接近 high 就机械替换。 |
| typo.family sans/mono | 公共栈与角色家族并存，当前 Sass 仅 mono 显式使用 | 合并字体来源，候选契约给出一个 UI 栈、一个 mono 栈及明确覆盖入口。 |
| breakpoint mobile/tablet/desktop = 768/1024/1280 | client-web 的 mobile/tablet/desktop Sass mixin 实际使用前两个阈值 | 保留构建时边界；角色名称不是设备检测。不同阈值是否调整不属于本次响应规则的默认动作。 |
| opacity muted/medium/strong = .72/.84/.92 | Button loading overlay 用 strong；另有 .9/.8/.4 局部状态值 | 保留公共旧值，明确为无量纲；状态透明度由其合成结果负责，不能用整组 opacity 统一实现所有反馈。 |
| ref.color：neutral 14、brand 13、danger 10、tertiary 2 | 主题映射及少量直接图形使用 | 保留色阶；直接取 primitive 要有明确局部用途。运行时改一个 ref 值不承诺自动改写所有语义角色。 |
| ref.layout（生成器空映射） | 源中无对应 Token，是生成器占位 | 归为清理候选；先检查公开 Sass 兼容，不据此建设布局框架。 |

## 配对计算与证据边界

以源中的不透明 sRGB 值按 [WCAG 相对亮度与对比度定义](https://www.w3.org/TR/WCAG22/#dfn-relative-luminance) 计算；以下不是浏览器全场景验收。普通文字通常需要达到 [4.5:1](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)，必要非文本线索另按其适用条件检查；装饰分隔线与禁用控件不能机械套用同一阈值。

| 源中配对 | 浅／深对比度 | 说明 |
| --- | --- | --- |
| text.primary / surface.base | 1.03 / 2.02 | DoubleCheck 普通表面标题误用了反色前景。 |
| text.subtle / surface.primary | 2.71 / 1.09 | Dropdown selected 的说明文字需要同动作背景相配的前景。 |
| text.muted / surface.base | 3.15 / 8.82 | 同名角色在浅色普通文字和深色层级上的意义不一致。 |
| on-danger / danger-hover | 2.56 / 6.17 | 浅色 hover 候选值不宜直接接入；当前 Button 使用 opacity，不能把这个结果报告为现有按钮 hover 的实测。 |
| feedback.error / surface.base | 深色 2.93 | 当前错误色在 subtle 上为 5.19，但不能推广为所有普通表面均可用。 |
| border.subtle / surface.base | 1.71 / 1.43 | 若边界是辨认输入控件所必需，则需要另选边界规则；本行不宣称所有使用该线色的容器都违规。 |

生成器、Sass/Uno 的复核与源哈希一同保留在工作包；静态计算用于淘汰不合适的候选和安排 B4，不能替代实际字体、透明度合成、内容布局及交互检查。
