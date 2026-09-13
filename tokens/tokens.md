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

## 角色与度量维护

共同的角色选择、配色关系、内容增长和扩展判断见 [DESIGN.md](../DESIGN.md)。本文件说明源格式与维护入口，不另裁决设计规则。

文本角色由字号、比例行高、字重和字距构成；精确值和叶节点用途在规范源中维护。字号采用 rem，行高为无量纲比例。不要把某个根字号下的像素结果反写成所有环境的固定要求。字体家族和装饰独立于尺寸角色。

修改名称、用途、值或引用时，核对 DESIGN.md 中跨角色的关系、受影响的组件与覆盖能力。新增或改变公开语义需要迁移说明；Figma 值导入不能改变这些元数据。

生成和导入的检查见[生成说明](../scripts/build-tokens.md)；默认消费方式、运行时覆盖范围见[样式指南](../packages/web/styles/README.md)。源变更须同时检查这些承诺及实际组件表现，生成成功不是视觉验收。
