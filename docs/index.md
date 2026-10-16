# Documentation

## Navigation

- [设计总纲与阅读路径](../DESIGN.md)：[设计立场](design/principles.md)、[视觉语言](design/visual-language.md)、[页面组合](design/composition.md)、[判断依据](design/reference.md)
- [Repository overview](../README.md)
- [Web package usage and development](../packages/web/README.md)
- [Package migration contract](../packages/web/MIGRATION.md)
- [UI Web Agent Skill generation](../scripts/build-agent-skills.md)
- [仓库开发约定](../AGENTS.md)与[组件维护指南](../packages/web/src/components/AGENTS.md)
- [Token 源与维护入口](../tokens/tokens.md)、[Token 生成说明](../scripts/build-tokens.md)
- [UI 基础能力工作包](../tasks/ui-foundations/packet.md)：当前任务的分组、决策和证据

Public component and styling facts are owned by source, package exports,
generated declarations, stories, and the package consumer skill. Delivery
behavior is owned by package scripts, repository scripts, and GitHub workflows;
this directory does not copy those executable contracts.

<!-- svc:begin navigation sha256=55c5c21e0087021bc7f81047e2ffe91f889b81829473655d86d78fbe2029d4f2 -->
## SVC CLI

Use `svc --help` and the installed SVC Skills for framework guidance. Project documentation outside this marked block remains Consumer-owned.
<!-- svc:end navigation -->
