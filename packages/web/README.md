# @inkcre/ui-web

InKCre 的 Vue 3 Web UI 库，提供组件、设计 Token、样式工具和随包 Agent Skill。

## 安装

包发布到 GitHub Packages 的 `@inkcre` scope，需要消费者具有读取权限。先按[仓库认证说明](https://github.com/InKCre/ui#github-packages-authentication)配置注册表和凭据，再在消费者项目中安装：

```bash
pnpm add @inkcre/ui-web vue@^3.5.25
```

从旧包名升级时，阅读[迁移说明](MIGRATION.md)。依赖范围和公开入口以所安装版本的 package.json 为准。

Vue 是需要宿主共享的运行时，支持范围为 ^3.5.25。CodeMirror、JSON 语言服务、VueUse 和 dayjs 由本包声明为运行时依赖，无需消费者逐项安装。使用 `/uno` 才需要安装声明范围内的 UnoCSS；预构建样式和普通组件不要求 UnoCSS。路由／国际化适配器不要求宿主采用 vue-router／vue-i18n。

JSON 语言服务当前固定为 5.6.4：组件依赖该版本的诊断消息和 schema 错误码语义。升级这项内部依赖时需要重新验证校验失败边界，源码联调不得用宿主的新版本强制替换它。

## 设计与使用入口

构建、审视或维护 UI 时，从 [DESIGN.md](DESIGN.md) 的总纲进入，按任务读取设计立场、视觉语言、页面组合或判断依据，再查所需组件参考。无需预先加载全部设计正文。总纲与 docs/design 一起随当前包版本交付，生产者未来版本的规则不自动适用于旧版安装。

应用入口加载样式；需要全局注册所有组件时安装插件：

```typescript
import { createApp } from "vue";
import App from "./App.vue";
import InKCreUIWeb from "@inkcre/ui-web";
import "@inkcre/ui-web/styles";

createApp(App).use(InKCreUIWeb).mount("#app");
```

局部组件使用命名导入，例如 `import { InkButton } from "@inkcre/ui-web"`，并同样在应用入口加载一次样式。全局组件类型需要时，将 `@inkcre/ui-web` 合并到消费者已有的 `compilerOptions.types`，不要覆盖其他类型入口：

```json
{
  "compilerOptions": {
    "types": ["@inkcre/ui-web"]
  }
}
```

Sass helper 与 Token 子路径见[样式入口](styles/README.md)。构建 CSS 包含组件内置图标和工具类，不包含 UnoCSS preflight。应用通过 icon 属性提供额外动态图标时，应在应用的 UnoCSS 配置中保证所需类能被提取，必要时显式声明 safelist；以实际使用的图标和生成 CSS 为准。

路由和国际化通过公开的 `InkRouter`、`InkI18n` 及对应注入键适配，接口边界见[随包集成参考](skills/ui-web/references/integration.md)。Locale bundle 从 `@inkcre/ui-web/locales` 导入。组件选型与组合入口见[随包 Skill](skills/ui-web/SKILL.md)。这些 Markdown 可直接阅读，不要求先安装 Agent 工具。

## 本地源码联调

以下命令在 UI 源码仓库根执行，要求存在相邻的 client-web checkout，且两个工作区都已按各自指南安装依赖：

```bash
pnpm generate
pnpm --dir ../client-web dev:ui --ui-source ../ui/packages/web
pnpm --dir ../client-web type-check:ui --ui-source ../ui/packages/web
```

将 `../ui` 替换为本地实际 checkout 路径。消费者拥有源码映射和 peer 运行时解析；正式构建与 CI 仍使用锁定的发布产物。Token 源变化后需重新生成。完整启动、清理和故障排查见[消费者开发指南](https://github.com/InKCre/client-web/blob/main/docs/40-deployment/development-runtime.md#joint-development-lanes)。

## Agent Skill

包在 `skills/ui-web` 提供一个渐进加载的 Skill。使用 TanStack Intent 的消费者在自己的 package.json 中明确配置可信包，并安装 Intent CLI（`pnpm add -D @tanstack/intent@0.3.6`）：

```json
{
  "intent": {
    "skills": ["@inkcre/ui-web"]
  }
}
```

```bash
pnpm exec intent list
pnpm exec intent load @inkcre/ui-web#ui-web
```

消费者仓库的 AGENTS 可明确要求：涉及 InKCre UI 时，读取已安装包的 `skills/ui-web/SKILL.md`，按其中入口读取同版本 DESIGN.md 和所需参考；纯后端任务无需加载。维护本库时由仓库 AGENTS 引导读取根级规范源。

Skill 是随包文档，发现和加载取决于消费者工具配置，不代表所有 Agent 都会自动启用它。维护者修改 `skill.seed.json` 或源码／Story 输入后，在源码仓库根运行 `pnpm build-skills`；不要直接编辑生成的 `skills/ui-web`。
