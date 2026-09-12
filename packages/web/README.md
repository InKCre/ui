# @inkcre/ui-web

InKCre 的 Vue 3 Web UI 库，提供组件、设计 Token、样式工具和随包 Agent Skill。

## 安装

包发布到 GitHub Packages 的 `@inkcre` scope，需要消费者具有读取权限。先按[仓库认证说明](https://github.com/InKCre/ui#github-packages-authentication)配置注册表和凭据，再在消费者项目中安装：

```bash
pnpm add @inkcre/ui-web
```

从旧包名升级时，阅读[迁移说明](MIGRATION.md)。依赖范围和公开入口以所安装版本的 package.json 为准。

## 使用入口

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

Sass helper 与 Token 子路径见[样式入口](styles/README.md)。应用使用动态图标时，应在应用的 UnoCSS 配置中保证所需类能被提取，必要时显式声明 safelist；以实际使用的图标和生成 CSS 为准。

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

包在 `skills/ui-web` 提供一个渐进加载的 Skill。使用 TanStack Intent 的消费者在自己的 package.json 中明确配置可信包，并确保消费者已安装 Intent CLI：

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

Skill 是随包文档，发现和加载取决于消费者工具配置，不代表所有 Agent 都会自动启用它。维护者修改 `skill.seed.json` 或源码／Story 输入后，在源码仓库根运行 `pnpm build-skills`；不要直接编辑生成的 `skills/ui-web`。
