# Web 样式入口

应用入口加载一次构建 CSS：

```typescript
import "@inkcre/ui-web/styles";
```

在消费者的 SCSS 中，通过公开子路径使用 helper：

```scss
@use "@inkcre/ui-web/styles/functions" as fn;
@use "@inkcre/ui-web/styles/mixins" as mixins;

.example {
  color: fn.sys-var(color, text, base);
  @include mixins.apply-font(body-lg);
}
```

Sass 需要底层映射时使用 `@inkcre/ui-web/tokens/ref`、`/tokens/sys`、`/tokens/comp`。这些引用中的完整包名前缀均为 `@inkcre/ui-web`；不要通过 node_modules 或 dist 的文件系统路径绕过 exports。

`tokens/_ref.scss`、`tokens/_sys.scss`、`tokens/_comp.scss` 和 `uno/preset-ink.ts` 都是生成物。在源码仓库中修改 Token 源后，从仓库根运行 `pnpm generate`；已安装包的消费者不直接修改这些文件。

现有 helper 定义见 [_functions.scss](_functions.scss) 与 [_mixins.scss](_mixins.scss)，消费指导见[随包样式参考](../skills/ui-web/references/styling-and-themes.md)。`sys-var`、`ref-var`、`comp-var` 只构造 CSS 变量引用，调用者需要核对实际定义。
