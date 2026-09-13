# I1 字体、轮廓与示例验收

2026-09-13，在 `feat/design-knowledge` 的未提交修改上完成。生产者包仍标记为 2.0.0，以下为本地候选产物，不是 registry 上已发布的 2.0.0。消费者继续使用正式版本，其局部修改由独立迁移 worktree 的工作包记录。

## 产物与检查

最终 `pnpm check` 通过，覆盖格式、lint、生成一致性、Intent、Token 工作流、类型、构建、两种包身份的严格独立安装及文档链接，以及 21 个 Story／120 个 Variant 的构建。首轮 Story 构建发现新样式缺少 Sass helper 的显式导入；补入后重新运行完整检查通过，没有扩大自动注入范围。

随后用 `pnpm --filter @inkcre/ui-web pack --pack-destination "$PWD/tmp/i1-pack"` 打包，SHA-256 为 `7be8c129cdee364977199b592da15f37cfca2af3df30d9c408f0afa58967ca8b`。临时 Vue/Vite 页面直接导入解包后的 `dist/index.js` 与 `dist/index.css`，没有引用组件源码。该检查补充已有的严格安装检查，不将复用仓库浏览器工具的页面称为独立安装。

## 浏览器结果

使用既有下游 Playwright 的 Chromium 149.0.7827.55；浏览器与临时服务器在验收后关闭，没有增加测试套件、依赖或发布入口。

| 边界                    | 实际结果                                                                                                             |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Switch 普通文案         | 外层使用 mono 时，控件仍采用系统 UI sans；技术性内容可以继续在各自局部使用 mono                                      |
| Switch 状态和尺寸       | 中英文、xs/sm/md/lg、浅深主题、320px／768px 下，Space／Enter 切换和 pending 前后的八个轨道宽度一致；pending 禁止操作 |
| AutoForm 根错误         | 非对象 schema 的错误直接可见，直角容器；320px 可完整换行，无页面横向溢出                                             |
| Image 缩略图槽          | 查看提示持续可见；Enter 打开、Escape 关闭并恢复缩略图焦点，浅深主题均通过                                            |
| Image 预览槽            | 自定义标题有清晰的前景／背景配对；下载链接实际保存 `inkcre.svg`，文件包含 SVG 内容，下载后预览保持打开               |
| AutoForm Story 调试内容 | JSON 使用 body-sm mono，浅深背景与文字同步变化，容器不再有硬编码圆角                                                 |

数值记录见 [打包组件结果](report.json) 与 [Story 操作结果](story-report.json)。代表图片为 [320px 浅色](components-light-320.png) 和 [320px 深色](components-dark-320.png)；它们是组件状态阵列，不是完整页面视觉样板，也不表示现有反馈色或阴影数值已完成校准。

Story 的复核入口为根级 `pnpm story:dev`。在 Controls/Switch 查看“长状态文案保持轨道尺寸”，在 Forms/AutoForm 查看“Invalid Schema Handling”和表单数据，在 Media/Image 操作“Custom Thumbnail Slot”“With Expanded Footer”“With Custom Header”。这批示例保持现有 Variant 数量，没有另造一套组件演示。

## 下游边界

独立 `feat/ui-v2-migration` worktree 的完整 `pnpm check` 与真实 Host／MF remote 重放通过。Twitter 步骤编号采用直角；375px 截图发现的向导宽度溢出同时修正，关闭按钮完整可见。已有中文注入、时间取消／确认、Mail 下载 pending／失败及窄宽页面旅程继续通过，pageerror 为零。

消费者仍锁定 registry UI 2.0.0，因此上述下游结果不代表生产者的新字体或设计文档已发布、安装。颜色／阴影数值的实验和页面内容层级复审仍分别属于 I2、I3。
