# Token 源与维护责任

[inkcre.tokens.json](inkcre.tokens.json) 是共享设计规则的规范源，由仓库维护角色、用途说明、类型和引用。当前保留 Figma 导出使用的 `type`、`value` 字段及 `custom-shadow` 类型，并非使用 `$type`、`$value` 的标准 DTCG 输入。Figma 可以提议已有路径的值更新；新增、删除、改名、类型和引用变化必须在仓库显式迁移，导入不能覆盖整份文件。

| 源层 | 责任 | Web 输出 |
| --- | --- | --- |
| `ref` | 基础色值、字体家族、空间、尺寸、圆角、断点、透明度 | `_ref.scss` 分类映射 |
| `typography` | 文本角色的字号、比例行高、字重、字距 | `$font` 和 `--sys-font-*` |
| `effect.elevation` | 阴影结构及透明颜色 | `$elevation` |
| `sys.light/dark.color` | 文本、表面、边界、反馈和遮罩的主题用途 | `$color-light`、`$color-dark` |
| `comp.light/dark` | Switch 的轨道、滑块和文字配色 | `$light`、`$dark` |

非颜色系统映射 `$base` 由生成器引用 ref 的分类和文本角色构成，不是遍历任意 sys 节点。源格式与角色可供将来的平台实现读取；目前只交付 Web 输出，没有 Flutter 或 uniapp 渲染器。

## 文本角色

默认字体为 `ref.typo.family.sans` 的系统 UI 字体栈，代码可选 `mono`；不下载字体。家族和装饰与文本尺寸分开，避免为等宽、下划线复制每个角色。下表的像素数仅是根字号 16px 时的结果：字号源用 rem，行高为无量纲比例，字重 400、字距 0。组件不设置 html 字号，字体回退由平台完成。

| 角色 | 字号／行高 | 默认用途 |
| --- | --- | --- |
| label-lg | 14／20 | 控件值、字段标签、常规按钮 |
| label-md | 12／16 | 短元信息、小按钮、Switch 状态 |
| body-sm | 14／20 | 说明、错误、提示和列表描述 |
| body-md | 16／24 | 普通正文 |
| body-lg | 18／24 | 需要强调的正文或引言 |
| title-sm | 22／28 | 区块、弹层标题 |
| title-lg | 28／36 | 常规页面标题 |
| headline-lg | 36／48 | 醒目的页面标题 |

label-lg 与 body-sm 当前度量相同，但用途和后续调整责任不同。长内容优先换行和扩展容器，不以 label-md 替代正常说明，更不再推荐 10px 的 label-sm。

## 配色与空间

普通表面的文字选 text.base 或 text.subtle；primary 与 danger 表面分别配 text.on-primary、text.on-danger。feedback.error/success/warning/info 用于 surface.base 或 surface.subtle 上的反馈前景，并配明确文字；没有推导出一套带色反馈容器。必要控件边界用 border.base，装饰分隔用 border.subtle，焦点用 border.strong。具体色值与说明在规范源中维护。

Button 的 hover 与 pressed 可共用主题 hover 表面；focus 是独立轮廓，error 边框与 focus 同时保留。pending 保留原有可读配色和文字，禁用动作及 hover；普通 disabled 使用次要文字、次要表面和装饰边界。Popup 与 Scrim 共用 overlay.scrim 的半透明黑色，Image 标题另用固定深色底板承载浅色文字，避免依赖图片内容的明暗。

基础间距为 xs/sm/md/lg/xl = 4/8/16/32/56px。字段内部通常用 xs，字段组用 md；按钮文字与图标距离、纵向留白使用局部 em。带框输入默认至少 36px 高，允许随文字增长。页面的列数、留白和容器响应由宿主决定，没有全局密度系数，也不要求所有空白跟随文字缩放。

生成和导入的检查见[生成说明](../scripts/build-tokens.md)；默认消费方式、运行时覆盖范围见[样式指南](../packages/web/styles/README.md)。源变更须同时检查这些承诺及实际组件表现，生成成功不是视觉验收。
