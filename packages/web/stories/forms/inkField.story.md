# inkField

InkField 负责标签、布局、必填提示和错误说明。给自定义控件提供稳定 id，并用 Field 的 `for` 关联它。`error` 显示校验消息，`errorId` 应与控件的 `aria-describedby` 一致；控件同时设置 `aria-invalid`。

默认槽放控件；`label-right` 放标签旁的辅助内容。省略默认槽时显示 value，editable 状态下使用原生按钮并发出 `value-click`。required 在 Field 上只是提示，真实输入约束由内部控件负责。

标签与 body-sm 错误文本允许换行，错误段落没有额外默认 margin。正常说明不要用更小的 label-md 压缩。
