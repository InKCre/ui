# inkInput

InkInput 的默认模式在每次输入时发出 `update:modelValue(string)`，即使 nativeType="number" 也传出字符串。需要数值的消费者在数据边界转换，不能把空字符串当成 0。

`type="inline"` 用按钮展示当前值，点击或 Enter/Space 进入编辑并聚焦输入框。Enter 先更新模型，再发出 `confirm(string)`，供消费者持久化；Escape 或失焦丢弃草稿并发出 cancel。IME 组合输入期间的 Enter 不提交。按键确认或取消后焦点回到触发按钮。editable=false 不允许进入编辑，disabled 禁用可编辑控件。

`nativeType` 设置 HTML input 类型。id、name、required、disabled、error 有明确入口，其余原生属性和监听器透传给输入或内联触发按钮；class/style 也在该原生元素上。提供 label 会生成唯一 id 和 label 关联，error 会关联到 aria-describedby。布局优先使用控件自己的 layout，其次是 InkForm 上下文。

```vue
<InkInput v-model="name" type="inline" label="名称" @confirm="saveName" />
<InkInput v-model="email" native-type="email" label="邮箱" name="email" required />
```

带框输入最小高度 36px、上下默认 4px 留白，随文字增长；inline 展示保持文本形态。错误边框与独立焦点轮廓同时保留。
