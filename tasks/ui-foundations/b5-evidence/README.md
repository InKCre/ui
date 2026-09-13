# B5 正式产物证据

本目录记录仓库内 B5 验收。最终消费页只加载新 tarball 的公开 JS/CSS、Sass helper 和 Uno preset，没有 B4 candidate.scss 或手工复制的候选角色值。

- 产物：本地 `@inkcre/ui-web@1.4.0` 标记的待发布构建；版本未提升，不能与 registry 已发布的同版本视为同一产物。tarball 位于 `tmp/b5-pack/inkcre-ui-web-1.4.0.tgz`，SHA-256 为 `f74c3d4161eef70676c27be3b481f78d7037d9236ada938982a03f57054484b8`。
- 消费实验归档：[consumer-experiment.tar.gz](consumer-experiment.tar.gz)，SHA-256 为 `cdff33ed37cf13e65c6527fb1f502057428288963a4aaa6f9382f1702abf55aa`。
- 完整检查：[pnpm-check.log](pnpm-check.log)，`pnpm check` exit 0；日志中循环引用报错属于导入 fixture 的预期失败。归档仅去除终端输出中的 NUL 字节和行尾空白。
- 最终浏览器：Chromium 149.0.7827.55，默认根字号 16px；页面容器 320／480／800px，补充视口 320px。测量见 [basic-measurements.json](basic-measurements.json)，38 个反馈／动作／选中前景配对最低对比度约 6.15，见 [basic-contrast.json](basic-contrast.json)。这不是整库完整可访问性认证。
- 默认组合、代码字体、modifier 叠加、异步状态和其他组件见 [basic-extra.json](basic-extra.json)。Recipe 使用最终 Skill seed 的完整示例，仅将包导入定位到 tarball 公开入口，宿主模拟成功／拒绝保存。

[普通表单](form-production-320.png)、[深色状态](states-dark.png)、[默认 Dialog](dialog-root16.png)、[图片标题](image-production-mixed.png) 均已实际查看。Dialog 与 DoubleCheck 的单一内边距、可用宽度，Spinner 的相邻布局和标题底板经图像核对，不能只靠“没有横向溢出”的断言判断。

[firefox-before-scope-change.json](firefox-before-scope-change.json) 来自用户收敛范围前的中间构建，保留为历史观察。它验证过原生文字缩放与页面缩放的区别；不作为最终 tarball 的完整浏览器兼容证据。用户随后明确停止该专项，最后一轮仅复核基本契约，没有再运行 Firefox 专项或添加浏览器专属适配。

## 复核方法

归档解压到 `packages/web/tmp`，形成 `b5` 子目录。先在仓库根生成、构建并打包，用独立目录保存本轮产物，保留原 B4 tarball：

```bash
pnpm generate
pnpm build
pnpm --filter @inkcre/ui-web pack --pack-destination "$PWD/tmp/b5-pack"
mkdir -p packages/web/tmp/b5-packed
tar -xzf tmp/b5-pack/inkcre-ui-web-1.4.0.tgz -C packages/web/tmp/b5-packed
node packages/web/tmp/b5/build-probes.mjs
```

用已有 Vue/Vite 环境将 `packages/web` 作为根目录在 `127.0.0.1:5199` 提供页面。验收脚本从本机相邻 client-web 的已安装 Playwright 1.61.1 导入 Chromium；异机运行时调整该工具路径，不需要给生产包新增依赖。依次运行 `basic.mjs`、`check-basic.mjs`、`basic-extra.mjs`；`inkcre-browser.mjs` 复核之前 C/D/E 的原生表单、焦点、日期和 schema 旅程。脚本及页面是隔离取证，不加入仓库 CI 套件。

实际发送端 payload、extension registry 的消费位置、client-web 的精确版本升级与远端 CI 尚未核验。生产者公开入口与模拟保存通过不能代替这些下游证据。
