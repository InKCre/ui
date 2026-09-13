# Token 与样式契约升级（待发布 major）

本次升级统一了文本角色、运行时读取与状态配色。包名、组件模型和事件沿用本文后续契约，但旧文本外观和部分 Token 路径不兼容。先升级依赖及锁文件，再迁移以下调用，最后以安装产物验证页面。不要把同名角色当成旧度量的兼容别名。

| 旧入口或用法 | 迁移选择 |
| --- | --- |
| `label-sm` 及 `font-label-sm`、对应 `--sys-font-label-sm-*`、Sass map | 短元信息用 label-md；正常说明／错误用 body-sm。移除 10px 默认信息角色，不提供旧别名。 |
| 其他已有文本角色 | 名称保留，采用 rem 字号、比例行高、400 字重、0 字距；label-lg 行高从 16 调至 20。复核高度与换行。 |
| 源／Sass map 中 `*-mono`、`lg-underlined` 复合角色 | 改为基础角色加家族／装饰；Sass `apply-font(label-lg, $mono: true, $underlined: true)`。旧 Uno mono/underlined 后缀仍接受，但采用新度量。 |
| 字体角色的 `font-family`、`text-decoration`、`font-style/stretch`、段落缩进／间距、text-case 等变量或 map 属性 | 四属性之外不再生成。家族读取 `--sys-typo-family-sans/mono`；装饰和段落布局显式写在使用元素上。 |
| `apply-font('title', 'lg')` | 改为 `apply-font(title-lg)`；第二参数是 mono 选项，不是字号。无效角色／选项现在编译失败。 |
| 不存在的 body-md | 现已提供 16/24 正文；输入框用途仍优先 label-lg。新增 body-sm 和 title-lg。 |
| `text.primary`／`text.danger-on` | 分别改为 `text.on-primary`／`text.on-danger`，仅用于对应强调表面；普通标题应选 text.base。 |
| `text.muted` | 普通次要文字改为 text.subtle。颜色和层级有意改变。 |
| `border.muted` | 装饰分隔用 border.subtle；必要控件边界用 border.base。base 已增强对比度。 |
| `surface.muted` | 普通容器按层次选择 surface.base/subtle，没有无条件等价别名。 |
| 不存在的 `color.success/warning/info.base`、`color.danger.base` | 改为 `color.feedback.success/warning/info/error`。 |
| 不存在的 `color.success.surface`、`color.danger.surface/light` | 默认使用 surface.subtle + 对应反馈前景，不自动新增彩色容器。 |
| 固定行高、Inter／独立 mono 字体依赖 | 检查系统 UI／mono 字体栈；库不再混用各角色字体，也不下载字体。Textarea 普通文本为 sans，代码显式 `mono`。 |
| 覆盖 `--ref-*` 或只修改 Sass maps 期待运行时联动 | 按[样式指南](styles/README.md)覆盖 sys 家族、文本四属性、颜色、space/radius。断点等仍为构建值。 |

颜色映射同时适用于 `--sys-color-*`、`sys-var(color, ...)`、`$color-light/dark` 的键和 Uno theme 色名；例如 `text-text-primary` 改为 `text-text-on-primary`。不保留会掩盖语义变化的双套颜色名。Uno theme.colors 的复合键按 Wind3 解析规则使用 camelCase（如 onPrimary、dangerHover）；工具类仍为 text-text-on-primary、bg-surface-danger-hover。直接读取 preset theme 的代码也需迁移。

Button pending 的覆盖层改为相邻 spinner；依赖 `ink-button__loading-overlay` 的样式需要移除。Button、带框输入和 Switch 的固定高度改为可增长的最小高度，Switch xs 从 18px 增至至少 24px，两个状态文案共同决定宽度。Dropdown 选中说明、DoubleCheck 普通标题、Image 标题底板和遮罩透明度已改正，Dialog 同样由 Popup 承担内边距，默认宽度上限 640px，窄视口两侧各留 16px；清理相应下游补丁后再复核。

已知 client-web 调用包括：settings 的 `apply-font('title', 'lg')`；LogsViewer／RecallSearch 的 body-md 和错误背景；JobCard／任务详情／peerCard 的反馈颜色；侧栏、来源内容和设置通知中的 muted；info-base/list 的页面标题与空间。逐处按用途迁移，不能全局机械替换。extension registry 的实际消费位置尚未确认，须在消费者验收中补齐。

Figma 导入也改变：仅更新已知路径的值，显式提供 releaseType，旧的全量导出包含已删除角色时会失败。维护者应更新发送端或准备只含已知值的提议；具体接收端格式见仓库 Token 生成说明。

验证浅深／系统主题、320px 窄容器、长中英文、200% 文字和浏览器缩放，检查焦点、错误、disabled、pending、selected，以及表单真实保存。生产者验证不代表消费者已升级；回退需同时恢复升级前依赖、锁文件和调用适配。

---

# 组件基础契约升级（待发布 major）

本节对应基础控件、弹层和 schema 编辑契约调整，尚未发布。选择包含这些变更的版本前，完成以下迁移并验证真实保存流程。

- InkButton 默认原生类型改为 button。表单提交写 `nativeType="submit"`；type 仍控制 default/square 外形。client-web 的 info-base/list 和 RecallSearch 搜索按钮依赖旧默认提交行为，需要明确标记。
- InkJsonEditor 的模型现在包含原始文本和无效 JSON。将直接 JSON.parse 的 computed setter 改为独立字符串草稿，监听 validation；仅在 valid=true 且结果 text 与草稿一致时解析和持久化。client-web 的 peerCard 配置编辑属于这种调用，必须迁移，否则输入中间态会让 setter 抛错。
- InkPicker 的内置日期选择只在 Confirm 更新 Date，取消不再提交。初始化可用 null；JSON 日期字符串应由消费者转换，InkAutoForm 已提供其内部字符串边界。
- Popup/Scrim 使用原生 dialog。提供 aria-label 或 aria-labelledby；不要依赖旧遮罩 DOM 选择器。scrim=false 保留非模态行为，默认模式由浏览器提供背景隔离、嵌套与焦点管理。
- useOptionalVModel 与内部 optional model 统一：传入非 undefined 的模型由父级控制，父级拒绝更新时显示不会擅自改变。传常量 false 不等于省略模型。
- Vue 支持范围收紧为 ^3.5.0，对应稳定唯一 ID 的 useId。浏览器需支持原生 dialog；不自动加载 polyfill。

```vue
<script setup lang="ts">
import { ref } from "vue";
import { InkButton, InkJsonEditor, type JsonEditorValidation } from "@inkcre/ui-web";
const draft = ref("{}");
const validation = ref<JsonEditorValidation>();
function save() {
  if (!validation.value?.valid || validation.value.text !== draft.value) return;
  const value: unknown = JSON.parse(draft.value);
  // 将 value 交给业务持久化入口，并处理该请求的 pending 与错误。
}
</script>
<template>
  <InkJsonEditor v-model="draft" label="配置" @validation="validation = $event" />
  <InkButton text="保存" :disabled="!validation?.valid || validation.text !== draft" @click="save" />
</template>
```

生产者本地验证不代表下游已升级；各消费者仍需安装精确发布版本后检查表单提交、内联保存、弹层关闭和 JSON 配置持久化。

---

## 从 `@inkcre/web-design` 迁移

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
