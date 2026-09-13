# 组件样式指南

组件外观优先使用现有系统或组件 Token。通过[Token 指南](../../../../tokens/tokens.md)找到源值和生成映射，使用前核对名称存在；`sys-var` 等函数只拼接变量名，不校验 Token 是否定义。

生产者的 [Vite 配置](../../vite.config.js) 为组件 SCSS 注入 functions 和 mixins。消费者或其他 Sass 入口需要按公开包路径显式导入，见[样式入口](../../styles/README.md)。

```scss
.ink-example {
  background-color: sys-var(color, surface, base);
  @include apply-font(body-lg);
}
```

普通组件优先使用 `sys-var`、`comp-var` 和 `apply-font`、`apply-icon`、`apply-elevation` 等现有 helper。需要 primitive 值时说明用途并核对 ref 层，不以硬编码或新同义 Token 掩盖缺失的语义。

CSS 类使用 BEM；嵌套应便于理解选择器和覆盖关系。简单布局可以使用现有 UnoCSS 工具类，组件的主题与状态样式留在组件 SCSS。新 CSS 特性是否适用取决于目标浏览器和消费场景。

图标使用已配置的 `i-mdi-*` 类，大小和布局可用 `apply-icon`。静态类由构建提取；动态名称需在对应构建入口验证能否生成，必要时在该入口的 UnoCSS safelist 声明，不要求消费者重复维护库内所有图标。
