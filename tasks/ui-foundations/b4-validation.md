# B4 场景验证与已选规则

B4 已完成。2026-09-13 用户要求“做 b4”后，本轮在隔离消费页比较 B—E 的实际打包实现和 B3 候选，完成 T-A—T-D、C-A—C-C、S-A—S-B、O-A—O-B 的裁决。本文是 B5 的实施输入；[B3 候选契约](b3-design-contracts.md) 保留最初假设，以本文的修订结果为准。生产 Token、生成器、组件、随包指南及消费者尚未应用这些规则。

## 实验身份与证据边界

实验使用分支 `feat/ui-foundations-components` 的既有 B—E tarball，版本标记仍为 `1.4.0`，不是已经发布的新版本。生产者 HEAD 为 `c5b230af2461d401fa9dc3ac8d5b356c20b89c46`；tarball SHA-256 为 `255bf8b311bf79e4cccd4e921b52834af7c36a2b8d7533426eefc744c86f247a`。候选通过最后加载的隔离 CSS、一个受限的 Sass／Uno 字体原型和 Switch 的隐藏尺寸占位实现，没有重写正式生成链路。重复的根 class 只用于让实验覆盖已打包的 scoped CSS，不是推荐的生产选择器。

浏览器为 macOS 上的 Chromium `149.0.7827.55`、Firefox `151.0`，Playwright `1.61.1`。Firefox 仅下载至本机浏览器缓存，没有新增项目依赖。字体比较覆盖 system-ui、明确不存在的首选字体后回退 system-ui、已安装的 Georgia，以及独立 mono 栈；未加载 Inter，没有把未加载的字体名当成 Inter 渲染通过。页面结构参考本地 client-web 的设置、peerList、Job 状态与 info-base/list，没有修改消费者仓库，也不表示消费者已经升级。

[证据目录](b4-evidence/) 保留代表截图及实验归档，归档内有源文件、测量 JSON 和复跑命令。本轮没有建立常驻测试套件或 CI 矩阵。截图经过实际查看，尺寸与状态检查不能替代视觉判断。正文中的对比度只证明列出的合法组合，不宣称整库已通过全部无障碍标准。

## 实验裁决

| 编号 | 观察结果 | 交给 B5 的规则 |
| --- | --- | --- |
| T-A | 320px 内容区内，旧长标签宽约 556px，超出字段约 236px；候选在 320/480/800px 均无字段横向溢出。14/20 的中文／英文标签和多行错误能完整排布，单行输入保留原生内部滚动。 | 控件文字与普通字段标签用 label-lg 14/20，帮助／错误用 body-sm 14/20；允许长标签及错误换行，不用 nowrap 或省略号兜底。移除字段错误段落的默认 margin，由字段 gap 控制关系。 |
| T-B | rem 根字号变化和 Firefox 原生文字放大分别通过；放大后 320px 内容区的表单、Switch 标签可用，实际提交与切换成功。原 Switch 的中文及 Enabled/Disabled 在 xs 滑块内裁切；新几何容纳两种文字。 | 统一 sans／mono 两个来源；普通 Textarea 用 sans，代码用途明确选择 mono。普通信息不再默认用 10px。固定 px 的基础空间不承担文字缩放责任。 |
| T-C | 旧 Sass 继承宿主 serif，Uno 指定 Inter；旧 Uno 继承 3px 字距，underlined 输出也不一致。原型的三个入口得到相同字号、行高、字体、零字距；Sass／Uno 的 mono 和 underline 一致。 | 统一角色与修饰输出，旧 mono／underlined 名称若保留，必须指向同一选择。**修订 B3：none 只能重置当前元素的装饰声明，不能取消祖先绘制的下划线**；不承诺任意装饰祖先下都无下划线。 |
| T-D | 22px 页面标题与卡片 22px 标题缺乏层级差；36px 在窄列表中占据明显更多空间。28px 能与卡片标题拉开层次；16px 正文适合连续说明，14px 卡片摘要／字段帮助保持次级阅读层次。 | 保留新增 title-lg 28/36、body-md 16/24、body-sm 14/20。原 title-sm 22/28 用于小节／弹层，headline-lg 36/48 用于醒目页头，body-lg 18/24 用于突出导语。尺寸相同不合并用途不同的 label-lg 与 body-sm。 |
| C-A | DoubleCheck 普通表面标题改用 base 后可读；Dropdown 选中说明改用 on-primary 后，浅深主题、鼠标及键盘高亮都可读。旧键盘高亮没有应用 selected-hover，浏览器复现了该差异。 | 采用 B3 的前景／表面配对；选中描述与标签共用 on-primary，用排布区分，不新增 on-primary-subtle。修正键盘与鼠标的选中高亮选择器。 |
| C-B | 三种按钮主题的默认／hover／pressed 配对通过；禁用与 pending 的 hover 不改背景。Input、Textarea 同时显示错误边界和独立焦点轮廓。Job／连接的四类反馈在普通表面与 subtle 容器上可读。 | 保留 B3 候选色值；非加载的禁用按钮采用现有 subtle 前景／表面与装饰边界，降低强调而保留文字可读性。hover 与 pressed 可共用已验收颜色，不新增 pressed 色阶。焦点用独立 2px 轮廓、2px 偏移。加载按钮保留可读文字并在旁边显示忙碌图形，不继续用近乎不透明的底色覆盖文字。 |
| C-C | 最亮底面上，黑色 .5 遮罩不能保证普通大小的浅色标题可读；局部 #070707 底板配 #f9f9f9 标题可读。复杂明暗图像仍保持原图内容，窄视口长标题可完整换行。 | 保留公共黑色 .5 遮罩；Image 标题拥有自己的不透明深色底板，不通过进一步压暗整张图解决标题问题。标题容器有最大宽度并允许换行，媒体仍保持比例。 |
| S-A | 1em 图形比原 sm 8px／md 12px glyph 更清楚，并能随文字增长；点击区域独立保持下限。第一次 Switch 自适应候选随 ON/OFF 改变宽度，放大时 xs 约 104→76px；加入两种标签的共同尺寸占位后不再跳动。 | 普通按钮图标 1em、图文 gap .5em；md 最小 36px，sm 最小 24px。Switch 两个等宽区域由两种状态文字共同决定宽度，滑块位移为自身区域宽度，保留尺寸 prop 的最小几何意义。 |
| S-B | 同为 1000px 视口，320px 侧栏的 viewport 规则左右各吃掉 70px，内容剩 178px；固定 16px 与容器候选均剩 286px。800px 主区中固定 32px 和容器候选分别剩 734／734.16px，无实质区别。 | 默认采用简单尺度：窄区 16px、宽主区按宿主用途选择 32px。撤回把本次容器曲线提升为共享 Token 的候选；不新增全局 density 或流式间距算法。 |
| O-A | 实际包 CSS／Sass／Uno 的颜色变量读取能共同响应根覆盖。旧 Uno p-md 仍为 16px，原型修正为根变量后与 CSS／Sass 同为 24px；字体大小／行高与家族也共同响应。浮层实际位于 body，得到根覆盖，而没有得到局部 wrapper 的 48px 间距。 | 保留 B3 根级覆盖边界；正式生成器必须兑现原型验证的依赖。局部变量不穿过 Teleport。主题 light/dark 优先于系统，system／省略跟随系统；Switch comp 颜色不随 primary 覆盖变化。 |
| O-B | 按随包 API 说明和候选指南完成设置页，验证原生提交、成功消息、服务器失败与字段关联。走读发现必须显式写 primary 主题，不能从“主操作”推断默认主题；默认主题实际为 subtle。 | B5 的默认配方明确写 `theme="primary"`、`native-type="submit"`、`layout="col"`、Input 自带 label/error，并给外置帮助文字说明。角色示例必须等正式输出存在后才能写成安装包可用能力。 |

O-B 是参与过维护的当前执行者走读，存在已有上下文，不是独立 Agent 的盲测。它证明这份默认配方能够运行，不能证明所有 AI 都能无误消费。

## 已收敛的尺寸与内容关系

保留 14/20、12/16 及 B3 标题／正文候选值；字号用 rem、行高用比例。字体修改由公开角色入口表达，宿主不需要改写库的 html 根字号。常规标签用 sans，技术 ID／代码明确用 mono。原 Textarea 的无条件等宽没有得到普通说明场景支持；B5 应提供最小的显式代码样式选择，不新建编辑器体系。

字段内部 gap 选固定 4px，表单字段组 gap 仍为 16px。盒状 Input／Dropdown／Picker 选 min-height 36px、上下 4px 留白：在 28/40 文字下增长到约 50px；.25em 候选增长到 56px，未发现额外收益，因此撤回。这个决定不把 inline 输入／Picker 强行改成盒状控件。原生单行输入按内容滚动，Textarea 按多行内容和自身可滚动边界处理。

Button 采用 md 最小 36px、sm 最小 24px，上下 .5em、左右现有 16px；各主题保留一致的 1px 边框空间。默认 14/20 的 md 高度为 36px，较大文字和多行标签自然增长；图文 gap .5em，glyph 1em。图标按钮和分页也保留独立点击区域，不把 glyph 尺寸等同目标尺寸。按钮的动画属性应明确列举，避免旧的无逗号声明退回 all 后连焦点轮廓也发生过渡。

Switch 的 xs 下限从 60×18 调整为至少 60×24，sm/md/lg 维持 80×24、100×36、120×48 的最小几何。实际宽度允许因字体和两种标签增长；例如默认 OFF 的 xs 约 61.22px，三字中文约 90px，Enabled/Disabled 约 133.22px。放大后两个状态仍保持相同外宽，滑块不出轨。原型以隐藏且 aria-hidden 的两种文字占位验证；B5 可以把两个状态标签直接放在同一网格位置，只显示当前态，从而避免 JS 测量或全局系数。

窄视口实验还发现 DoubleCheck 的内外层重复留白，会把操作文字挤成逐字换行。B5 由 Popup 统一提供内边距，确认内容取消重复 padding；确认弹层采用不超过 400px 且受视口两侧 16px 留白约束的宽度，操作区允许换行。320px 视口和根字号 32px 下，标题、按钮内容与取消操作已复核。这里的视口约束属于 body 浮层，不应推广成普通侧栏的空间依据。

## 缩放、对比度和入口的实测要点

Firefox 通过本机临时 profile 的原生 `ZoomManager` 执行文字缩放，走的是浏览器自己的 textZoom 路径；并未通过 transform、截图拉伸或逐元素注入字号模拟。原生机制与 [Firefox 的文字缩放说明](https://support.mozilla.org/en-US/kb/font-size-and-zoom-increase-size-of-web-pages) 一致。本机 Firefox 自带的 `viewZoomOverlay.js` 也明确区分 textZoom 与 fullZoom。

| 操作 | 固定 13px 文字 | 固定 100px 方块 | CSS 视口 | 意义 |
| --- | --- | --- | --- | --- |
| 原始 | 13px；字框高 16px | 100px | 1000px | 对照 |
| Firefox textZoom=2、fullZoom=1 | **26px；字框高 32px** | **100px** | **1000px** | 实际文字放大 200%；表单提交和 Switch 切换仍可用 |
| Firefox textZoom=1、fullZoom=2 | 计算字号仍为 13px | 计算宽度仍为 100px | **500px** | 实际页面缩放；表单仍可使用，没有水平溢出 |
| Chromium 根字号 16→32px | 固定 px 不因此变大 | 100px | 不变 | 单位依赖实验；不能替代上一项文字放大证据 |

Chromium 的 `setEmulatedOSTextScale` 和通过 Playwright 发给页面的 Firefox 缩放快捷键，在最初尝试中均未改变哨兵值；这些尝试没有计为通过。最终原生文字缩放的 13→26px 测量及实际操作保存在归档的 `firefox.json`。组合边界还覆盖 320px 视口（扣除宿主边距后内容区为 272px）与根字号 32px。

实际选中＋高亮说明的对比度约为浅色 8.11、深色 6.50；确认标题与普通表面约为浅色 20.14、深色 8.82。危险按钮新的 hover 前景／背景约为浅色 8.93、深色 7.41。全部测量按未舍入结果验收，hover／pressed 可以同色，不把状态之间的色差误当成文字对比度要求。适用依据仍为 [WCAG 文字对比度](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) 与 [必要非文本线索](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)。

Sass／Uno 的字体原型验证了“共同读取变量”能够解决差异，**没有证明正式生成器已经修好**。根角色实验覆盖字号、行高和字体家族；正式迁移仍须检查角色内其他公开属性的依赖。相同元素声明下，零字距和 none 装饰结果一致；祖先下划线仍会绘制，截图和指南都保留这个限制。容器实验明确使用 `.host { container-type: inline-size }`；由于没有选择容器曲线进入正式规则，不再扩展无容器回退能力。

## B5 的输入与退出边界

B5 按 [既定实施方案](plan-l1-token-system.md) 迁移源、生成器、组件、指南和兼容说明，本轮不创建发布 Changeset。实施时重点保留这些约束：

1. 从 Token 源生成统一角色和 CSS／Sass／Uno 输出；原型 class、额外占位和高优先级选择器不能原样转为公开 API。
2. 全量复核 21 个组件的受影响文字、边界和几何。B4 的代表页不能替代 Tooltip、Loading、日期列表、AutoForm、JsonEditor 等全部受影响位置的正式迁移验收。
3. 明确旧字体／颜色名称的迁移方向，恢复样式指南职责，并把已经跑通的默认配方写入现有 Skill 输入。不要把 task packet 的实验历史复制成消费指南。
4. 重走本轮窄内容、长文本、真实文字放大、深色错误／加载和输出覆盖场景，并用最终 tarball 验证。B4 的临时原型通过不能替代最终产物通过。
5. Figma 的真实 payload、受限导入和 Changeset 分类仍属于 B5；真实消费者接入由 G 继续核实。extension registry 的代码位置缺口保持未解决状态，Flutter／uniapp 输出继续按真实消费需求启动。

本轮仅修改工作包并建立隔离实验；未提交、推送、发布或修改消费者。生产及工程文件的哈希检查与开始 B4 时一致，未把已有 B—E 未提交改动纳入本轮新增改动。
