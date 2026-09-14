# UI 发布与真实消费者迁移

2026-09-13，用户授权提交、发布 UI，并在独立分支和 worktree 中迁移 client-web 及各 extensions。这次授权覆盖必要的 UI PR、检查、合并和正式包发布，以及消费者源码、指南、依赖和验证。消费者应用及扩展的生产发布不在此次 UI 包发布范围中。

## 2.0.0 首次发布路径

首次发布时 UI 分支为 `feat/ui-foundations-components`，基线 `origin/main` 为 `9f7267c`；包含尚未合入 main 的 L0、B—E/B5 和本轮 L3。按组织治理通过 PR、最新 main 检查和 squash 合并，再由 Changesets 的独立版本 PR 准备 major，回到 main 后正式发布。不得从功能分支直接发布 canonical 包，不使用管理员绕过。

复用 L3 最终完整 pnpm check、产物／浏览器证据；本轮只先校正未发布 Changeset 和迁移入口残留的旧 Vue 下限，使同一发布说明一致使用 ^3.5.25。PR 与版本 PR 按实际提交重新执行远端检查。发布后记录源码、运行和 registry 产物身份，并在消费者从 registry 安装精确版本。

## 消费者工作区

从最新 `origin/main` 的 `54882ac` 创建 `feat/ui-v2-migration`，路径为 `/Volumes/WorkSSD/Development/InKCre/.worktrees/client-web-ui-v2-migration`。原始 `/Volumes/WorkSSD/Development/InKCre/client-web` checkout 与其未跟踪文件保留。消费者本地工作入口为该 worktree 的 `tasks/ui-v2-migration/packet.md`，拥有具体迁移与验证记录；本文件只记录跨仓发布依赖和最终关联。

目标从 UI 1.4.0 的旧调用迁移到正式 major：Web、mail、twitter 一起核对依赖／共享 Vue、Token 与 Sass、提交行为、JSON 原始草稿、浮层，以及 Agent 同版本文档读取。保留原有业务、身份、权限、数据库与 Module Federation 交付责任，不顺手升级 Core 或更改共享 Hub。

要求在真实 registry 依赖下完成 pnpm check／build、受影响的现有 E2E 与关键页面检查；源码联调另行验证，不能作为发布安装替代。当前 main 与前轮盘点基线不同，先重新调查实际调用再实施。

## 2.0.0 首次发布记录

- UI 功能 [PR #43](https://github.com/InKCre/ui/pull/43) 已合入为 `2b553ab`；Changesets 版本 [PR #44](https://github.com/InKCre/ui/pull/44) 已合入为 `9e80e89`。
- [Release run 34739131474](https://github.com/InKCre/ui/actions/runs/34739131474) 成功，2026-09-13 04:59 UTC 发布 [@inkcre/ui-web@2.0.0](https://github.com/InKCre/ui/releases/tag/%40inkcre/ui-web%402.0.0)。registry metadata 与消费者 lockfile 的 integrity 一致：`sha512-YWaSG3dTQ+yGCWbcDDHb6RTeSVMmBcV+QDjjpYupSzqTc4H7MSUEcjSWgl2vf/yjO5LJQatlnJl0qoDk68lJqg==`。
- GitHub Actions 自动创建版本 PR 的权限被仓库设置拒绝；沿用其已生成的版本分支手工建立 #44，全部检查通过后合入，未更改权限或绕过保护。
- 消费者四个包（包括 ext-dev-utils）均已安装正式 2.0.0，迁移代码位于 [client-web PR #104](https://github.com/InKCre/client-web/pull/104)，本地完整 check、源码联调类型检查、Intent load 和实际 Chromium 扩展 popup E2E 已通过。真实数据库 E2E 因机器 SSH provider 不可用，继续由该 PR 的隔离 CI 验证；具体结果只在消费者工作包维护。
- extension registry 独立 UI 与 Figma 发送端的位置缺口继续保留。

## 2.0.1 正式修复发布

UI [PR #46](https://github.com/InKCre/ui/pull/46) 保留设计知识、I1、I2 与 Header 修复的独立提交，通过 rebase 合入；版本 [PR #47](https://github.com/InKCre/ui/pull/47) 检查通过后合入 `85453b50eee3a8e1db21cdedaca05ba0b6051dd6`。[Release 34798879363](https://github.com/InKCre/ui/actions/runs/34798879363) 成功，2026-09-14 02:22 UTC 发布 [@inkcre/ui-web@2.0.1](https://github.com/InKCre/ui/releases/tag/%40inkcre/ui-web%402.0.1)。[Histoire 部署](https://github.com/InKCre/ui/actions/runs/34798879375) 成功，展示站为 https://design.inkcre.dev。

registry integrity 为 `sha512-8KELh89mLA1xjoB8uDFmh8HJfHn6UAeJRWVaKM3w4UKLt11tsuw9/22rEUDfHp9U5y4d5MecQRrKt3MH2zQO5Q==`。消费者 Web、Mail、Twitter 与 ext-dev-utils 从 GitHub Packages 安装精确 2.0.1，lockfile integrity 与 registry 一致，四处安装的 UI JS／CSS 字节一致。新版本同时交付设计知识、字体和配色调整，不能把验收限定为图标修复。

消费者继续复用 PR #104，不随 UI 发布自动合并或发布应用、原生扩展。完整验证和当前部署身份由消费者 task packet 维护。

消费者运行时代码最终为 `d027230`，完整本地检查、[CI 34799554488](https://github.com/InKCre/client-web/actions/runs/34799554488) 及真实远端浏览器重放通过。[Preview 34799553542](https://github.com/InKCre/client-web/actions/runs/34799553542) 部署至 https://52f3ec3f.inkcre-client-web.pages.dev；使用实际同源 Registry 和 Mail／Twitter MF 资源，业务状态使用隔离夹具，pageerror 为零。源码／部署身份、正式包身份、浅深菜单和新版配色截图在消费者 `evidence/ui-2.0.1` 归档。UI 版本对应 Histoire 不可变部署为 https://29a08650.design-dd4.pages.dev。
