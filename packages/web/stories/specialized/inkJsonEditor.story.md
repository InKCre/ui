# inkJsonEditor

InkJsonEditor 的 `v-model` 是原始文本，包括未完成或语法无效的 JSON。不要在模型 setter 中直接 JSON.parse，也不要把它视为已经通过 schema 校验的字符串。外部模型更新替换编辑器文本，但不重复发出 update:modelValue。

validation 事件传出 JsonEditorValidation，包含对应 text、status、valid 和 messages。每次编辑先报告 pending；只有 status=valid 且 text 与当前草稿一致时才允许保存，届时再 JSON.parse。无 schema 仍校验 JSON 语法；空文本不是 JSON 值。

每个实例隔离 schema 配置和缓存。更新 schema 或 schemaUri 会重新校验；过期结果不会覆盖新文本的结果。语法/schema 错误和服务不可用都可见，服务异常另发出 error。editable=false 或 disabled 使用 CodeMirror 只读模式。

Story 的“Validated save and isolated editors”演示两个 schema 并存，以及如何在无效输入期间禁用保存。label 为编辑区提供名称，error 和诊断关联到 aria-describedby。JSON Schema 编辑需要包声明的 CodeMirror 和语言服务依赖。

编辑器文本读取 label-lg 角色和系统 mono 家族，避免入口不同导致字体被覆盖。第三方编辑器内部布局与语法主题仍由 CodeMirror 管理。
