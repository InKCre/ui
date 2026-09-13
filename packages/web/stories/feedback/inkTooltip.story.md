# inkTooltip

InkTooltip 为已有控件提供补充说明，悬停或焦点进入显示，移出或焦点离开隐藏，Escape 关闭。默认槽应包含可以聚焦且有可访问名称的控件。

槽参数 describedby 是 tooltip 的唯一 id。将其传给控件的 aria-describedby，让说明与触发控件关联；不要在浮动说明内放按钮或表单。

```vue
<InkTooltip content="同步最新数据" v-slot="{ describedby }">
  <InkButton icon="i-mdi-refresh" aria-label="刷新" :aria-describedby="describedby" />
</InkTooltip>
```

提示说明使用 body-sm；必要信息与错误应保留在正常页面流中。
