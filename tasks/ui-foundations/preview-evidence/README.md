# PR preview 验收

[UI PR #46](https://github.com/InKCre/ui/pull/46) 的 `9128425` 通过[完整 CI](https://github.com/InKCre/ui/actions/runs/34759790243) 和 [Histoire preview 交付](https://github.com/InKCre/ui/actions/runs/34759846429)。本轮实际进入[远端 preview](https://pr-46.design-dd4.pages.dev)，验证正式构建的控件与展示应用；源提交和不可变部署 URL 见[结果](verification.json)。

浅深主题各 41 个变量和 I2 冻结值一致。375px 下验证 Switch 键盘切换、宽度稳定、系统 UI 字体和 pending；Image 键盘打开、Escape、焦点归还和实际 SVG 下载；Button 的原生表单提交。1280px 下通过 Histoire 正常导航选择 Variant、修改状态并查看源码，pageerror 为零。

- Switch：[浅色](switch-light-375.png)、[深色](switch-dark-375.png)。
- Image 下载：[浅色](image-light-375.png)、[深色](image-dark-375.png)。
- [展示控件与源码面板](story-source.png)。截图已人工复核；Histoire 外壳的绿色、圆角属于展示工具，不作为 InKCre 消费页面的视觉范本。

复跑现有任务脚本，第二个参数使用已有 Playwright 的 `index.mjs` 绝对路径，不增加本仓库依赖：

```sh
pnpm exec node tasks/ui-foundations/preview-evidence/verify.mjs /absolute/path/to/@playwright/test/index.mjs https://pr-46.design-dd4.pages.dev
```

远端首次复验发现 Histoire 原配置将 Vue 替换为 CDN 生产版本，并用空对象模拟 Shiki，造成状态同步和源码面板错误。独立 `9128425` 删除这两层替换，完整 `pnpm check` 与本地正式产物检查通过后，再完成本次远端复验。当前展示站常规打包的 vendor 约 12.24 MB（gzip 2.31 MB），保留后续性能优化的真实边界。

消费者仍安装 registry UI 2.0.0，不包含本 PR 尚未发布的 I2 配色。消费者的 Host／Mail／Twitter 实际 preview 与 SSH 数据库结果由其 PR #104 工作包拥有，不能用此处的展示页替代下游安装验收。
