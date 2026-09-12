# `@inkcre/ui-web` 维护指南

本包实现 InKCre 的 Web UI。先遵循[仓库约定](../../AGENTS.md)，消费者安装和使用方式见 [README](README.md)。

## 技术与边界

运行时组件使用 Vue 3、TypeScript、Sass 和 UnoCSS。UnoCSS 同时用于图标与部分布局工具类，配置在 [uno.config.ts](uno.config.ts)。库通过 `InkRouter`、`InkI18n` 及对应注入键接入消费者的路由与国际化；Histoire 中的 vue-router／vue-i18n 配置不代表消费者必须采用相同实现。

## 维护入口

| 内容                                   | 入口与责任                                                                                      |
| -------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 组件行为、props、events、models、slots | `src/components/`；继续阅读[组件指南](src/components/AGENTS.md)                                 |
| 公开组件身份与分类                     | `component-manifest.json`                                                                       |
| 公开导出与类型                         | `src/index.ts`、`package.json#exports`；生成声明随构建产出                                      |
| Story 与行为说明                       | `stories/<category>/`                                                                           |
| Token、Sass 与 UnoCSS 输出             | `styles/`；维护方式见[样式指南](styles/README.md)                                               |
| 消费者 Skill                           | `skill.seed.json` 与源码／Story 输入；生成方式见[脚本说明](../../scripts/build-agent-skills.md) |
| 包构建与展示构建                       | `vite.config.js`、`vite.subpaths.config.js`、`histoire.config.ts`                               |

`src/public-components.ts`、`src/components.d.ts`、`src/version.ts`、Token 输出和 `skills/ui-web/` 是生成物。修改源头后，从仓库根执行 `pnpm generate`；不要手改生成物。

## 开发与验证

在仓库根安装依赖并运行命令。组件预览使用 `pnpm story:dev`；类型检查使用 `pnpm type-check`；完整基线使用 `pnpm check`。本包不设自动化单元／组件套件，不为每个组件创建测试文件。

选择与改动对应的类型、lint、生成物、打包或 Story 检查。键盘、焦点、异步交互和视觉表现通过受影响的 Story 或真实消费页面核对，按仓库引用的组织政策决定是否需要持久自动化。

修改公开行为或随包文档后更新相应消费者说明，并运行 `pnpm changeset` 记录发布影响。包边界以构建和打包产物为准；源码联调不能替代公开入口验证。
