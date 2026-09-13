# UI 发布与真实消费者迁移

2026-09-13，用户授权提交、发布 UI，并在独立分支和 worktree 中迁移 client-web 及各 extensions。这次授权覆盖必要的 UI PR、检查、合并和正式包发布，以及消费者源码、指南、依赖和验证。消费者应用及扩展的生产发布不在此次 UI 包发布范围中。

## 发布路径

UI 当前分支为 `feat/ui-foundations-components`，基线 `origin/main` 为 `9f7267c`；包含尚未合入 main 的 L0、B—E/B5 和本轮 L3。按组织治理通过 PR、最新 main 检查和 squash 合并，再由 Changesets 的独立版本 PR 准备 major，回到 main 后正式发布。不得从功能分支直接发布 canonical 包，不使用管理员绕过。

复用 L3 最终完整 pnpm check、产物／浏览器证据；本轮只先校正未发布 Changeset 和迁移入口残留的旧 Vue 下限，使同一发布说明一致使用 ^3.5.25。PR 与版本 PR 按实际提交重新执行远端检查。发布后记录源码、运行和 registry 产物身份，并在消费者从 registry 安装精确版本。

## 消费者工作区

从最新 `origin/main` 的 `54882ac` 创建 `feat/ui-v2-migration`，路径为 `/Volumes/WorkSSD/Development/InKCre/.worktrees/client-web-ui-v2-migration`。原始 `/Volumes/WorkSSD/Development/InKCre/client-web` checkout 与其未跟踪文件保留。消费者本地工作入口为该 worktree 的 `tasks/ui-v2-migration/packet.md`，拥有具体迁移与验证记录；本文件只记录跨仓发布依赖和最终关联。

目标从 UI 1.4.0 的旧调用迁移到正式 major：Web、mail、twitter 一起核对依赖／共享 Vue、Token 与 Sass、提交行为、JSON 原始草稿、浮层，以及 Agent 同版本文档读取。保留原有业务、身份、权限、数据库与 Module Federation 交付责任，不顺手升级 Core 或更改共享 Hub。

要求在真实 registry 依赖下完成 pnpm check／build、受影响的现有 E2E 与关键页面检查；源码联调另行验证，不能作为发布安装替代。当前 main 与前轮盘点基线不同，先重新调查实际调用再实施。

## 当前状态

- UI：准备提交 L3 及证据，随后创建覆盖全部基础整治的 PR。
- 消费者：独立分支和 worktree 已建立，开始基于最新 main 调查。
- extension registry 独立 UI 与 Figma 发送端的缺口仍保留，不阻塞已明确的 client-web／extensions 迁移。
