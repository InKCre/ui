# 从 `@inkcre/web-design` 迁移

本页说明旧包身份迁移到 `@inkcre/ui-web` 的操作。`@inkcre/ui-web` 延续旧包的 `1.2.x` 版本线，身份迁移保留了 Vue 组件与类型（`Ink*`）、CSS 类（`.ink-*`）、Sass API 和设计变量。后续版本的变化应同时阅读 [CHANGELOG](https://github.com/InKCre/ui/blob/main/packages/web/CHANGELOG.md)，不能将身份迁移的兼容承诺推广到所有版本升级。

## 消费者操作

1. 选择已发布的目标版本，将依赖改为精确版本的 `@inkcre/ui-web`。
2. 替换旧包导入，包括 `/styles`、`/styles/functions`、`/styles/mixins`、`/tokens/*`、`/utils`、`/locales` 和 `/uno` 等公开子路径。
3. 移除曾用于绕过旧 exports 问题的 node_modules 或 dist 文件系统别名。
4. 更新消费者锁文件，然后用冻结安装、类型检查、构建和受影响页面验证该精确产物。开发源码联调不能替代此步骤。

## 依赖边界

新包将声明的 peer 外置。消费者的安装图必须能解析目标版本声明的依赖；其中 `vscode-languageserver-textdocument` 是 InkJsonEditor 的显式 peer。以目标版本 `package.json` 和消费者锁文件为准，不靠本机已有的开发依赖补齐缺失项。

## 随包 Skill

当前 Skill 位于 `skills/ui-web`，旧 `agent-skills/` 不再提供。消费者在自己的 package.json 中显式信任包：

```json
{
  "intent": {
    "skills": ["@inkcre/ui-web"]
  }
}
```

已安装 TanStack Intent 的消费者可运行 `pnpm exec intent load @inkcre/ui-web#ui-web`。也可以直接阅读[随包 Skill](skills/ui-web/SKILL.md)；它是文档入口，不是运行时 JavaScript 导出。

## 回退

回退时恢复消费者升级前的依赖、锁文件、导入和相关适配，再验证完整消费流程。历史身份迁移使用 `@inkcre/web-design@1.2.2` 作为回退版本；当前应用若已采用较新的组件能力，应使用自身升级前的版本，而不是直接回退到历史迁移提交。

旧包的可安装性、权限和废弃状态应在需要回退时查询 registry，本页不承诺其当前远端状态。包注册表认证入口见[安装说明](README.md#安装)。
