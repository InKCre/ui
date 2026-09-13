# inkDoubleCheck

InkDoubleCheck 为一个破坏性动作展示独立的确认弹层。默认槽放一个有可访问名称的按钮；组件在捕获阶段阻止该按钮的原始 click 动作，打开弹层。真正的业务操作必须绑定在 DoubleCheck 的 confirm 上。

取消、Escape 或遮罩关闭都不发出 confirm。确认关闭弹层并发出 confirm。它不等待业务 Promise；如果需要展示保存等待或错误后重试，使用 InkDialog。

```vue
<InkDoubleCheck title="删除记录" message="此操作不可恢复。" @confirm="deleteRecord">
  <InkButton text="删除" theme="danger" />
</InkDoubleCheck>
```

标题使用普通表面上的 text.base，尺寸为 title-sm。Popup 统一承担内边距，弹层宽度不超过 400px 或视口减 32px，长内容与操作允许换行。
