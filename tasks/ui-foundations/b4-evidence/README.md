# B4 实验证据

结论与边界见 [B4 场景验证](../b4-validation.md)。截图是实际浏览器输出；只保留能解释取舍的代表样本，未把所有排列复制进仓库。

| 文件 | 说明 |
| --- | --- |
| [form.png](form.png) | 320px 内容区的候选表单；长标签、错误和说明换行。 |
| [text200.png](text200.png) | Firefox 原生 textZoom=2 的表单，固定 px 哨兵的放大证据在归档 JSON。 |
| [hierarchy.png](hierarchy.png) | 自上而下比较 22／28／36px 标题和 14／16／18px 正文；卡片内容一致。 |
| [selected-before.png](selected-before.png)、[selected-after.png](selected-after.png) | 深色选中项说明的配对修订。 |
| [error-focus-dark.png](error-focus-dark.png) | 深色错误边界、文字和独立焦点轮廓。 |
| [states-dark.png](states-dark.png) | 每行分别为可用、禁用、加载；保留文字与忙碌提示。 |
| [confirm-large.png](confirm-large.png) | 320px 视口、32px 根字号下的确认弹层；取消／确认操作可用。 |
| [image.png](image.png) | 窄视口的复杂图像与完整标题；局部深色底板。 |
| [spacing.png](spacing.png) | 同一窄内容区，自上而下比较 viewport、固定 16px、固定 32px、容器候选。 |

[experiment.tar.gz](experiment.tar.gz) 保存本次隔离页面、候选样式、Sass／Uno 原型构造、指南走读、一次性浏览器旅程和 JSON 测量结果。SHA-256：`3c0b75f38a95d4a93100f57c2a31b8abc28ed0485533555f33237258d72ff593`。该归档是执行证据，不是新的组件测试套件、公开样式包或生产代码来源。

## 在本工作区复跑

需要既有依赖与 B—E tarball：`tmp/inkcre-ui-web-1.4.0.tgz`，SHA-256 为 `255bf8b311bf79e4cccd4e921b52834af7c36a2b8d7533426eefc744c86f247a`。B4 开始／结束对 234 个非 task 文件做哈希核对，没有新增差异。若未来已经执行 B5，应使用归档对应的旧 tarball 作基线，不能把新生成包误当成原对照。

从仓库根运行；解压会写入专用的忽略目录，若已有同名实验需要保留，先另存该目录。

```sh
mkdir -p packages/web/tmp/packed
mkdir -p packages/web/tmp/b4
tar -xzf tmp/inkcre-ui-web-1.4.0.tgz -C packages/web/tmp/packed
tar -xzf tasks/ui-foundations/b4-evidence/experiment.tar.gz -C packages/web/tmp
node packages/web/tmp/b4/build-probes.mjs
pnpm --filter @inkcre/ui-web exec vite --host 127.0.0.1 --port 5199
```

Vite 在单独终端保持运行；对照入口为 `http://127.0.0.1:5199/tmp/b4/review.html`。在另一个终端执行需要复核的具体旅程：

```sh
node packages/web/tmp/b4/run.mjs
node packages/web/tmp/b4/check-results.mjs
node packages/web/tmp/b4/edges.mjs
node packages/web/tmp/b4/overrides.mjs
node packages/web/tmp/b4/color-entries.mjs
node packages/web/tmp/b4/final-overlay.mjs
node packages/web/tmp/b4/run-firefox.mjs
```

脚本目前引用本机 `client-web` 已安装的 Playwright 1.61.1，以及缓存中的 Firefox 151.0；移到其他机器时要改这两个环境路径。它们没有新增 package.json 依赖。Firefox 脚本创建自己的 `/tmp/inkcre-b4-firefox-*` profile，使用本机端口 2830 的 Marionette 连接及浏览器自带 ZoomManager，结束时关闭自己的进程。运行前确保该专用端口空闲。不要让它连接日常浏览器 profile。

主要 JSON 为 `measurements.json`（尺寸、配色、入口）、`contrast.json`（从实际样式计算）、`firefox.json`（原生缩放及操作）、`edges.json`（间距比较、窄屏与指南）、`overrides.json`、`color-entries.json`、`final-overlay.json`。归档中的候选 CSS 有试验期间的覆盖层，最终选择以 B4 报告为准。B5 必须从正式源建立一致实现，再用最终产物复核。

本轮通过上述场景检查及 `git diff --check`。生产源码未变，因此没有重复执行此前 B—E 已通过的整库 `pnpm check`；B5 正式迁移仍按方案执行完整检查。
