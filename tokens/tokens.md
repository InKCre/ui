# Token 源与维护责任

[inkcre.tokens.json](inkcre.tokens.json) 是共享设计规则的规范源，由仓库维护角色、用途说明、类型和引用。当前保留 Figma 导出使用的 `type`、`value` 字段及 `custom-shadow` 类型，并非使用 `$type`、`$value` 的标准 DTCG 输入。Figma 可以提议已有路径的值更新；新增、删除、改名、类型和引用变化必须在仓库显式迁移，导入不能覆盖整份文件。

| 源层                   | 责任                                               | Web 输出                      |
| ---------------------- | -------------------------------------------------- | ----------------------------- |
| `ref`                  | 基础色值、字体家族、空间、尺寸、圆角、断点、透明度 | `_ref.scss` 分类映射          |
| `typography`           | 文本角色的字号、比例行高、字重、字距               | `$font` 和 `--sys-font-*`     |
| `effect.elevation`     | 阴影结构及透明颜色                                 | `$elevation`                  |
| `sys.light/dark.color` | 文本、表面、边界、反馈和遮罩的主题用途             | `$color-light`、`$color-dark` |
| `comp.light/dark`      | Switch 的轨道、滑块和文字配色                      | `$light`、`$dark`             |

非颜色系统映射 `$base` 由生成器引用 ref 的分类和文本角色构成，不是遍历任意 sys 节点。源格式与角色可供将来的平台实现读取；目前只交付 Web 输出，没有 Flutter 或 uniapp 渲染器。

## 角色与度量维护

共同立场从 [DESIGN.md](../DESIGN.md) 进入；文字、配色与空间关系由[视觉语言](../docs/design/visual-language.md) 维护，共享与变化理由由[设计立场](../docs/design/principles.md) 维护。本文件说明源格式与维护入口，不另裁决设计规则。

文本角色由字号、比例行高、字重和字距构成；精确值和叶节点用途在规范源中维护。字号采用 rem，行高为无量纲比例。不要把某个根字号下的像素结果反写成所有环境的固定要求。字体家族和装饰独立于尺寸角色。

修改名称、用途、值或引用时，核对相应设计正文中跨角色的关系、受影响的组件与覆盖能力。新增或改变公开语义需要迁移说明；Figma 值导入不能改变这些元数据。

颜色调整从 `sys.light/dark.color` 的用途进入，连同前景、背景和交互状态一起维护。`ref.color.brand` 引用中性色阶；`ref.color.danger` 提供红色基础值，不决定危险按钮的底色。`surface.danger` 与 `feedback.error` 分别维护，避免调整按钮面积色时连带改变需要注意的错误文字。不要为了把所有色值塞入同一色阶而建立缺少共同变化理由的引用。

生成和导入的检查见[生成说明](../scripts/build-tokens.md)；默认消费方式、运行时覆盖范围见[样式指南](../packages/web/styles/README.md)。源变更须同时检查这些承诺及实际组件表现，生成成功不是视觉验收。
