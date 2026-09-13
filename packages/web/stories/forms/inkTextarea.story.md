# inkTextarea

InkTextarea 使用具名模型 `v-model:value`，每次输入发出 `update:value(string)`。原生 textarea 接收 id、name、required、disabled，以及 maxlength、autocomplete 等透传属性。

label 与 textarea 自动关联；error 显示并通过 aria-describedby 关联校验信息。editable=false 展示只读文本。布局可独立设置，也可继承 InkForm 的响应式 layout。

```vue
<InkTextarea v-model:value="description" label="说明" name="description" :maxlength="500" />
```

默认使用系统 UI 字体；代码或固定宽度内容设置 mono，编辑和只读模式都读取系统等宽字体。错误边框与焦点轮廓独立。
