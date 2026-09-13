# B—E 实施记录

用户已授权提交 L0 并实施 B、C、D、E。L0 提交为 `c5b230a`，本次工作分支为 `feat/ui-foundations-components`。本文件持续记录切片、兼容决定与证据，状态索引见 [packet](packet.md)。

## 范围与实现顺序

B 拥有 Token 主题入口、引用有误的组件 SCSS、既有包契约检查及对应说明；先修现有语义映射和主题优先级，再检查产物引用。C 拥有基础控件、字段上下文与模型 helper；D 拥有 Popup、Dialog、Scrim、DoubleCheck 和日期交互；E 拥有 schema 服务、AutoForm 与 JsonEditor。每组同步已有 Story、说明、Skill seed 和必要生成物。

运行时和包检查只修改本仓库。消费者通过只读调用盘点与临时真实浏览器消费页验证；正式下游升级、平台扩展、AI 提取器整体改造仍不在本次范围。

## B—E 实施时的决定

- 本片先保留已有 Token 命名，错误引用映射到现有语义，不批量增加别名；后续 B3—B5 已重新定义角色并完成正式迁移，见 [B5 记录](b5-execution.md)。显式 light/dark 优先于系统，省略主题或 system 跟随系统。
- 普通按钮采用显式原生 button 类型，提供 nativeType 提交入口。client-web 的 info-base/list 与 RecallSearch 有依赖默认提交的调用，发布前须迁移为 nativeType="submit"；不能将本次发布标作完全兼容的补丁。
- 保留已有模型命名和可行的兼容入口，新增能力不以重写全部组件为目标。异步结果必须区分请求身份，失败不得伪装为成功。
- 运行时行为通过临时的浏览器消费页验证，不建立逐组件挂载测试套件。B 的变量完整性放在已有产物契约边界。

## 进度

B、C、D、E 已实现并验证。组件说明、代表性 Story、Skill seed、生成物和 major Changeset 已更新；最终完整 `pnpm check` 及实际 tarball 的浏览器旅程通过。这些改动随后与 B5 的正式迁移一并整理为 b9c0bc6，未推送或发布。

## 已实施的切片

| 组  | 实施结果                                                                                                                                                  | 兼容边界                                                            |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| B   | 修复无定义变量引用与显式主题优先级；shadow 数值长度转换为 px；现有打包检查验证变量引用完整性；内置图标和工具类随包交付，关闭 UnoCSS preflight。           | 未增加同义 Token，未迁移输入格式。                                  |
| C   | 明确原生按钮类型；标签、输入属性、错误关联与 Form 布局响应；内联 confirm/cancel；Dropdown 键盘和加载身份；Switch 竞态及基础辅助语义。                     | Button 默认不再提交；optional-model 统一为父级控制非 undefined 值。 |
| D   | 原生 dialog 负责模态焦点与嵌套，保留 modeless；异步期间关闭保护；DoubleCheck 捕获触发；日期草稿、12 小时/星期列及范围处理。                               | 日期确认才提交；浮层 DOM 改变，需要支持 dialog 的浏览器。           |
| E   | schema 服务和缓存按实例隔离并复制输入；已有值优先，数字草稿和日期字符串边界；根级错误、失败状态与过期校验保护；JsonEditor 原始文本模型与独立 validation。 | JsonEditor 的旧有效 JSON 模型变为原始文本，必须迁移保存入口。       |

新增共享模块限于字段关联、Promise 布尔状态和原生 dialog 生命周期三个实际复用点；没有新增运行时依赖、overlay manager 或测试框架。为使用 Vue useId，peer 与开发声明收紧为 ^3.5.0，锁文件仅更新这一声明。

## 发布与下游

新增 [major Changeset](../../.changeset/clean-shrimps-pump.md)，保持版本号 1.4.0，尚未执行 version/publish。迁移细节已进入 [随包 MIGRATION](../../packages/web/MIGRATION.md)。client-web 的两个搜索提交按钮和 peerCard JSON.parse setter 是已核实的迁移点；Input inline 的 confirm 现在提供其持久化监听要求的事件。未修改下游仓库，未把本地模拟保存旅程当作下游已升级。

F 的 API 提取器改造、G 的最小依赖安装与全部消费者盘点、H 的平台扩展继续留在各组。现有 Skill 输入已更新本轮确定的契约，不宣称 F 全部完成。

## 最终验收（2026-09-13）

`pnpm check` 完整通过：格式、lint、生成物、Skill、Story 覆盖、Token 更新工作流、类型、库构建、两种包身份的契约检查及 Histoire 构建。共 21 个 Story、114 个 Variant。`git diff --check` 通过；Changesets 将本包列为 major，未运行 version 或 publish。

浏览器消费页使用 `pnpm pack` 的实际 tarball 解包 JS 与 CSS；由本地 Vite 提供页面，使用既有 Playwright/Chromium 运行，不从生产者组件源码导入。pnpm 为 11.17.0，完整构建使用仓库指定 Node 22.22.3。最终 tarball 路径为 `tmp/inkcre-ui-web-1.4.0.tgz`，SHA-256 为 `255bf8b311bf79e4cccd4e921b52834af7c36a2b8d7533426eefc744c86f247a`。这是本地验收产物，不能作为已发布版本安装身份。

| 边界               | 操作与结果                                                                                                                                                                                                                                                                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 主题与样式         | 系统 light/dark × 应用 light/dark/system/省略共 8 种组合，color-scheme 和实际背景调色板均匹配；阴影非 none，内置菜单／导航图标有有效 mask 和颜色。检查浅色、深色、日期弹层截图。                                                                                                                                                   |
| 原生表单与内联保存 | 普通动作和 Switch 不提交，显式提交有效，必填输入阻止空提交；click 为 MouseEvent。原生属性和标签可定位，Form 布局动态更新。内联 Enter 传出新模型与 confirm，IME Enter 不确认，Escape/失焦不保存。                                                                                                                                   |
| 控件异步与键盘     | Dropdown 键盘打开、移动和选择成功；替换加载器后旧结果不覆盖新选项，失败可见。Switch 过期 Promise 被忽略，拒绝通过 error 报告而不产生未处理页面异常。Tooltip 在焦点保留时不会因指针离开消失，Escape 可关闭。                                                                                                                        |
| 弹层与日期         | 焦点进入、嵌套 Escape 只关闭顶层、关闭后恢复触发焦点；modeless 背景可操作。Dialog pending 阻止 Escape、遮罩和重复确认，过期结果与拒绝均受控。DoubleCheck 阻止原按钮动作，只在 confirm 执行。Picker 取消保留原值，确认提交闰月末日；12 小时列无重复，日期范围夹取后显示与模型一致，倒置范围显示错误。Image 预览可由键盘打开和关闭。 |
| 数据与校验         | 两个不同 schema 的编辑器和两个表单并存有效；保留已有值、0、false 及额外属性。未完成数字保留为无效草稿，空数字删除字段并显示必填根级错误；日期确认后仍是 JSON 字符串。无效 JSON 原文同步到模型且保存按钮禁用；过期远端 schema 响应不覆盖新结果，404 进入 error 并显示诊断，调用方 `$ref` 保持不变，另一实例不受影响。               |

临时页面位于被忽略的 `packages/web/tmp/`，脚本和日志位于本机 `/tmp/inkcre-*`，不属于永久测试套件。主要日志为 `inkcre-check-final.log`、`inkcre-packed-browser-final.log`、`inkcre-packed-edges-final.log` 和 `inkcre-visual-final.log`。长期复核入口是对应 Story 及上表的操作步骤；临时文件可能被系统清理。

验收中修复了三个静态构建未能单独发现的边界：Vue 将 Promise getter 的拒绝送入全局错误处理；语言服务原地改写响应式 schema 的 `$ref`；隐藏 dialog 中原生 select 初始未显示当前选项。现有包契约还拦住了 CommonJS peer 的 ErrorCode 命名导入问题，现改用类型约束的协议常量，Node ESM 与浏览器均通过。

验收不涵盖完整浏览器矩阵、读屏软件实测、真实 client-web 持久化、extension registry 升级或远端 CI。组件内置图标已随包交付；应用传入额外动态图标仍由应用 UnoCSS 配置负责。上述边界已同步到长期文档，不把本地证据推广为所有消费者的交付完成。
