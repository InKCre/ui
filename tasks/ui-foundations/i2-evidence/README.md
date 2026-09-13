# I2 正式源与产物验收

用户已认可[修订后的场景校准](../i2-study/README.md)。选定的配色、Switch 与阴影值现已进入 `tokens/inkcre.tokens.json`，沿既有生成链同步 Sass、CSS 和 Uno 输出。150 个公开 Token 路径及类型保持不变，没有新增主题机制、角色或依赖。

`ref.color.brand` 引用对应中性色阶；红色基础值中更新了反馈使用的 40／70 两级。危险动作底色直接由 surface.danger／danger-hover 维护，与较纯的错误前景分开，未新增另一套色阶。反馈角色说明、设计与样式指南、Agent 配方和普通提交示例同步更新；迁移指南说明新默认表现，并将已发布的 2.0.0 要求与当前未发布改动分开。

## 验证结果

完整 `pnpm check` 通过，涵盖格式、lint、生成一致性、Token 导入边界、类型、独立 tarball 安装与公开入口、文档／配方交付，以及 21 个 Story／120 个 Variant 构建。循环引用夹具原先隐式依赖正文指向 neutral.2，本轮改为显式构造闭环的两端；生成器与导入策略没有改变。

[实际产物验收页](index.html)直接使用本地 tarball 的组件和根级主题，不覆盖候选色值。[浏览器记录](verification.json)由 Chromium 149.0.7827.55 生成：

- 浅深主题各 41 个颜色、Switch 与阴影变量和冻结样稿一致。此前候选 84 个配对的结果因而适用于该产物：浅／深最低文字对比约 5.14:1／4.95:1，必要边界约 3.86:1／3.61:1。
- primary／subtle／danger 的普通、hover、pressed、焦点、disabled 与 pending 配对通过。错误输入保留独立焦点提示；Dropdown 的选中标签、说明及相邻活动项分别使用对应前景。
- Popup/Scrim 实际 Teleport 到 body，表面、文字与遮罩使用根级主题；Popup 打开期间切换根级主题也能更新。375px 下确认操作完整可见，关闭后焦点返回触发按钮，页面无横向溢出。
- Sass 与 Uno 三档可见阴影和样稿一致，实际 Tooltip 使用相同的默认档。运行时修改 md 模糊变量会更新 Sass 与 Tooltip，Uno 保持构建值；其工具类的前景／背景配对也通过验证。
- 页面脚本错误与 HTTP(S) 请求均为零。已查看六张截图，浏览器已关闭；离线页面无需服务。

截图：控件与选中项[浅色](controls-light.png)／[深色](controls-dark.png)，375px Popup [浅色](popup-light-375.png)／[深色](popup-dark-375.png)，375px Scrim [浅色](scrim-light-375.png)／[深色](scrim-dark-375.png)。这是状态与公开入口的验收夹具，阴影探针及按钮矩阵不作为真实页面的组合范本。

Uno 验收保留 presetWind3 的初始化样式；阴影工具类依赖它提供的 ring/shadow 变量。记录保留完整计算值，比较时排除透明的 ring 合成层。UI 包仍不引入 preflight，夹具没有向生产包添加全局样式。

## 产物身份与复跑

本地 tarball 仍标记 `@inkcre/ui-web@2.0.0`，**不是 registry 已发布的 2.0.0**。SHA-256 为 `a2d8e5ecffeaa58aca0ea60e4bcfdf77d486d9b694c91fbc3775ec5708da0f5d`。基线提交为 `11be433`，叠加尚未提交的 I2 源；[artifact.json](artifact.json)另记录 Token 源与 CSS 的哈希，source 字段不表示 I2 已提交或发布。

从仓库根执行：

```sh
pnpm check
pnpm --dir packages/web pack --pack-destination ../../tmp/i2-pack
node tasks/ui-foundations/i2-study/build.mjs tmp/i2-pack/inkcre-ui-web-2.0.0.tgz --delivery
node tasks/ui-foundations/i2-study/verify-delivery.mjs /path/to/existing/playwright/index.mjs
```

构建与浏览器脚本复用现有工具，不建立组件测试套件。完整检查日志为本机 `/tmp/inkcre-i2-check.log`，浏览器日志为 `/tmp/inkcre-i2-delivery-verify.log`。构建会清理临时解包目录，实验与证据随父工作包撤除。

生产者 I2 已验证、未提交或发布。消费者 worktree 保持干净，仍使用 registry UI 2.0.0；后续发布后需要按真实安装版本复验，不能把此处的产物夹具当作下游迁移完成。I3 继续拥有真实页面的内容取舍与状态组织。
