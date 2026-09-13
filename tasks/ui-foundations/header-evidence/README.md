# Header 菜单图标修复验收

原按钮直接承载 Uno mask，又把填色重置为透明。修复将 mask 放到 aria-hidden 的子 span，保留原生按钮、Menu 名称、至少 24×24px 操作区域与 menu-click。按钮自身没有 mask，键盘焦点轮廓不会随图标裁剪。

完整 `pnpm check` 与正式 Story 构建的本地浏览器检查通过，见 [本地结果](local.json)。浅深主题分别在 375px／1280px 验证图标 mask、非透明且跟随文字的填色、按钮透明背景与未裁剪的焦点，以及点击图标、Enter、Space 每次只发出一个菜单事件。pageerror 为零。

[浅色菜单及焦点](header-light-375.png)、[深色菜单及焦点](header-dark-375.png)已人工复核。Basic Story 用输出次数呈现事件；它是组件交互示例，不是业务页面布局范本。

复跑：

```sh
pnpm exec node tasks/ui-foundations/header-evidence/verify.mjs /absolute/path/to/@playwright/test/index.mjs https://pr-46.design-dd4.pages.dev
```

脚本复用既有 Playwright，不新增组件套件。必须对包含本修复的产物执行；registry UI 2.0.0 及当前消费者 PR #104 仍含原缺陷，不能将本地探针或生产者 preview 视为下游已修复。消费者需安装正式修复版本后复验。
