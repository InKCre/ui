# Token 源与维护入口

[inkcre.tokens.json](inkcre.tokens.json) 是本仓库的设计 Token 源，当前采用 Figma 导出的 `type`、`value` 字段，包含 `custom-shadow` 等类型。它不是直接使用 `$type`、`$value` 的标准 DTCG 格式；维护时应以实际输入与生成器支持的结构为准。

| 源层                             | 当前内容                                         | Web 输出                                     |
| -------------------------------- | ------------------------------------------------ | -------------------------------------------- |
| `ref`                            | 颜色、间距、圆角、尺寸、字体基础值、断点和透明度 | `_ref.scss` 中的分类映射                     |
| `effect.elevation`、`typography` | 阴影和复合字体值                                 | `_ref.scss` 的 `$elevation`、`$font`         |
| `sys.light/dark.color`           | 浅色与深色语义颜色                               | `_sys.scss` 的 `$color-light`、`$color-dark` |
| `comp.light/dark`                | 各主题的组件语义值                               | `_comp.scss` 的 `$light`、`$dark`            |

具体名称和值直接查看源文件及生成映射，不在本页复制一份手工清单。当前非颜色系统映射 `$base` 由生成器引用 ref 分类构成，不是遍历全部 sys 节点得到。

生成命令、路径、现有转换限制与 Figma 更新入口见 [Token 生成说明](../scripts/build-tokens.md)。Web Sass 的消费入口见[样式说明](../packages/web/styles/README.md)。修改 Token 要同时检查生成差异和受影响组件的视觉表现；生成成功不代表所有 CSS 变量引用都有效。
