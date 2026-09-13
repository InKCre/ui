# L3 验证证据

本目录对应 [L3 执行记录](../l3-execution.md)，基线为 `c67cc88`，验证日期为 2026-09-13。生产者仍标记 1.4.0，使用的是包含未发布改动的本地 tarball；不是 registry 中 1.4.0 的验收。精确 tarball 与关键文件摘要见 [artifact.json](artifact.json)。

## 最终结果

| 检查 | 结果 | 证据 |
| --- | --- | --- |
| 完整 pnpm check | 退出 0；21 个 Story、120 个 Variant | [完整日志](pnpm-check.log) |
| 最终 tarball 独立安装 | 退出 0；最小依赖、严格声明、指南配方、Intent 与可选 Uno/Sass | [包契约日志](package-contract.log) |
| 三份指南配方浏览器旅程 | 保存成功／失败、原始 JSON、路由／语言／主题、320px；无 pageerror | [结果](browser.json)、[复跑脚本](browser-check.mjs) |
| 生成器失败边界 | 过期 DESIGN.md 和未知 helper 均拒绝，之后已还原并通过 check:skills | [结果](generator-boundaries.json) |
| 真实 Web 与扩展声明检查 | Web 两个 graph 回调错误；mail、twitter 退出 0 | [汇总](consumer-types.json)、[Web 日志](consumer-web.log)、[mail 日志](consumer-mail.log)、[twitter 日志](consumer-twitter.log) |
| 现有源码联调 | 退出 2；两个 graph 错误与五项宿主 JSON 版本覆盖错误 | [日志](consumer-source-overlay.log) |
| 局部接入补丁 | git apply --check 通过，未应用 | [补丁](client-web-integration.patch) |

完整检查使用仓库固定的 Node 22.22.3／PNPM 11.17.0；隔离消费者使用 Vue 3.5.25、TypeScript 5.9.3、vue-tsc 3.3.8、Vite 7.2.7、Intent 0.3.6，可选阶段安装 UnoCSS 66.5.10。浏览器脚本使用本机既有 Playwright 1.61.1 与 Chromium 149.0.7827.55，没有为仓库增加浏览器测试依赖或套件。

消费者声明实验读取原有源文件并使用其现有 tsconfig 选项，只替换 UI 声明入口并显式共享宿主 Vue 3.5.40。它不安装新 UI 到消费者，不证明 Sass 迁移、运行时交互或真实页面已经通过。mail 的错误 loading 属性正是静态检查未能发现、人工调用核对发现的例子。

## 复跑本地交付与浏览器

先从仓库根生成并构建当前产物，或直接运行完整检查。保留浏览器用的临时目录时，执行：

```bash
pnpm exec tsx scripts/check-package-contract.ts --keep
```

命令结束会输出 `Consumer retained at ...`；下文 `<temporary-root>` 替换成该目录。消费者已含从安装包指南提取的三个配方，只需换入演练宿主，它负责模拟保存和切换上下文：

```bash
cp tasks/ui-foundations/l3-evidence/App.vue <temporary-root>/consumer/App.vue
pnpm --dir <temporary-root>/consumer exec vite --host 127.0.0.1 --port 5203 --strictPort
```

另一个终端传入本机已有 Playwright 的 ESM 模块路径：

```bash
node tasks/ui-foundations/l3-evidence/browser-check.mjs <playwright-module>/index.mjs
```

脚本更新结果 JSON 与两张截图。它检查真实可观察状态，不访问组件内部状态；截图前等待有限动画结束。演练宿主 [App.vue](App.vue) 的 save 是可失败的 500ms 模拟请求，三份消费配方来自安装包；不连接真实账户或后端。

深色弹层截图见 [integration-dark.png](integration-dark.png)，320px 普通容器见 [recipes-320.png](recipes-320.png)。两张图片受根级 PNG 忽略规则影响，后续整理提交时需显式纳入，避免检出后链接失效。临时 tarball、消费者 node_modules 和开发服务器不纳入仓库；检查后可停止服务器并删除临时目录。

## 复跑真实声明兼容检查

```bash
node tasks/ui-foundations/l3-evidence/consumer-types.mjs ../client-web <temporary-root>/consumer/node_modules/@inkcre/ui-web
git -C ../client-web apply --check ../design/tasks/ui-foundations/l3-evidence/client-web-integration.patch
```

声明脚本只在系统临时目录写 tsconfig，结果写回本目录，结束后删除临时配置。Web 保留两个已知错误，因此脚本整体预期退出 1；消费者代码没有被补丁修改。仓库名称不同的 checkout 需替换补丁路径。升级后重跑的结果应重新标记其源码版本，不覆盖本轮结论而不更新工作包。

生成器负向演练是在 `try/finally` 中临时修改包内 DESIGN.md，以及把 InkInput 的已知 helper 导入改为未支持的别名；分别运行 `skill:generate:check`，断言明确报错，再逐字节恢复。当前已恢复后的 Skill 检查通过；负向结果不表示工作树仍处于错误状态。
