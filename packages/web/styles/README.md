# Web 样式与 Token 使用

先使用组件及其默认布局，再为页面文字和空间选择角色。应用入口加载一次 `@inkcre/ui-web/styles`；自编译 Sass 入口时不要再重复加载预构建 CSS。样式包含组件内部图标和工具类，不包含 preflight，也不设置 html 字号或下载字体。组件安装见[包 README](../README.md)，旧版本升级见[迁移说明](../MIGRATION.md)。

## 从设计选择到 Web 调用

文字角色、配色组合、状态和布局责任见 [设计指南](../DESIGN.md)。本指南负责把这些决定映射到 CSS、Sass 和 UnoCSS，以及说明覆盖在哪里生效。

常见正文使用 body-md，说明使用 body-sm，页面标题使用 title-lg。普通表单从 InkForm 的 `layout="col"` 开始；主提交动作明确写 `theme="primary" native-type="submit"`。完整可检查的表单、JSON 保存和适配器示例见 [组合配方](../skills/ui-web/references/composition-recipes.md)。

## CSS、Sass 与 UnoCSS

CSS 自定义属性可以直接读取；纯 CSS 文字角色要完整声明需要的属性：

```css
.page-copy {
  font-family: var(--sys-typo-family-sans);
  font-size: var(--sys-font-body-md-font-size);
  line-height: var(--sys-font-body-md-line-height);
  font-weight: var(--sys-font-body-md-font-weight);
  letter-spacing: var(--sys-font-body-md-letter-spacing);
  text-decoration: none;
  color: var(--sys-color-text-base);
  padding: var(--sys-space-md);
}
```

Sass 使用公开子路径。bundler 可直接解析包路径；Node Sass 使用 `NodePackageImporter` 时加 `pkg:` 前缀。

```scss
@use "@inkcre/ui-web/styles/functions" as f;
@use "@inkcre/ui-web/styles/mixins" as m;
@use "@inkcre/ui-web/tokens/ref" as ref;

.page-copy {
  @include m.apply-font(body-md);
  color: f.sys-var(color, text, base);
  padding: f.sys-var(space, md);
}
.code-id {
  @include m.apply-font(label-lg, $mono: true);
}
.link-label {
  @include m.apply-font(label-lg, $underlined: true);
}
```

`apply-font(role, $mono: false, $underlined: false)` 接受完整角色名；mono 也接受旧的第二参数 `mono`。它输出六个属性，包括 none 装饰和零字距对应的变量。`apply-font('title', 'lg')` 是错误调用，应改为 `apply-font(title-lg)`；`label-lg-underlined` 不是 Sass 角色名。子元素的 `text-decoration: none` 无法移除祖先已经绘制的下划线，应将装饰放在正确的元素上。

使用 UnoCSS 时将 presetInk 放在 Wind3 后，并保留消费者自身需要的 preset：

```ts
import { defineConfig, presetWind3 } from "unocss";
import { presetInk } from "@inkcre/ui-web/uno";
export default defineConfig({ presets: [presetWind3(), presetInk()] });
```

```html
<p class="font-body-md text-text-base p-md">正文</p>
<span class="font-label-lg font-mono underline">resource_id</span>
<div class="bg-surface-subtle text-feedback-error p-md">保存失败，请重试。</div>
```

font-mono/font-sans 和 underline/no-underline 选择家族及装饰。旧 Uno 后缀 `font-label-lg-mono`、`font-label-lg-underlined` 仍解析为基角色加修饰，但采用本版角色度量；它们不承诺保留旧字体外观。Uno 自定义图标仍需应用自身提取或 safelist。

## 主题和覆盖边界

`html[data-theme="light"]` 或 `dark` 优先于系统偏好；省略 data-theme 或设为 system 时跟随系统。覆盖样式加载在库之后，主题颜色使用匹配选择器：

```css
html[data-theme="dark"] {
  --sys-color-surface-primary: #f9f9f9;
  --sys-color-text-on-primary: #070707;
}
:root {
  --sys-typo-family-sans: system-ui, sans-serif;
  --sys-font-label-lg-font-size: 1rem;
  --sys-font-label-lg-line-height: 1.5;
  --sys-space-md: 20px;
}
```

| 入口                                  | 支持的传播                                                    |
| ------------------------------------- | ------------------------------------------------------------- |
| 系统颜色、sans/mono 家族、角色四属性  | CSS、apply-font、Uno 角色在运行时读取；颜色须成对复核所有状态 |
| sys.space、sys.radius                 | CSS/Sass 变量读取与 Uno 间距、圆角工具类共同响应              |
| Sass maps、Uno 尺寸／图标／断点／阴影 | 构建值；改变源后重新生成、构建                                |
| 任意 ref 变量                         | 不保证带动已经解析的 sys 或 comp，优先覆盖明确的系统角色      |

Popup/Scrim Teleport 到 body，保证的是根级覆盖；局部 wrapper 的字体或主题覆盖不会自动跟随弹层。组件内部必要计算留在组件中，普通页面 CSS 可自行定义布局。页面可以按容器选择 16px 或 32px 留白，但没有共享的自动密度算法。改字体、配色或空间后，根据影响复核长中英文、窄容器，以及焦点、错误、pending 和选中状态。
