# inkAutoForm

InkAutoForm 将 object schema 的 string、number、integer、boolean、嵌套 object、数组、本地 `$defs/$ref` 和简单 nullable 映射为现有控件，不提供条件表单框架。根 schema 和不支持的字段类型会显示错误。`format: password` 只让输入框遮蔽文字，不改变配置读写语义。

使用 `v-model:formData` 接收对象。初始化或 schema 改变时只给缺失字段补 default，已有值（包括 0、false、空字符串和 null）优先；schema 中未列出的已有属性保留，是否允许由 schema 校验。外部 formData 更新不重新套默认值，因此清空数字不会被默认值重新填回。

普通 nullable 文本直接显示输入框；未编辑时 null 和未设置字段保持原样，实际输入或删除文字才生成字符串，包括空字符串。字段旁的“清空值”动作显式写入 null。nullable object、array、Boolean、enum 和日期仍通过“设置值”进入其非 null 状态。Boolean 字段使用小号开关，标签与普通输入保持同一阅读层级。

“Nested credentials, arrays and nullable values”用例同时展示 null、空字符串与未设置文本；修改后从调试数据检查三者，并用“禁用字段”检查输入和清空动作均不可操作。

数字使用文本输入以保留未完成的负号或指数，完整值转换为有限 number，无法转换的草稿保留为字符串并产生校验错误；空数字删除该属性，整数和上下界继续由 schema 校验。日期格式保留为 JSON 字符串：date 使用本地日历 YYYY-MM-DD，date-time/datetime 使用 ISO UTC 时间戳，time 使用带 Z 的 UTC 时间。仅在打开 Picker 时转换为 Date，确认才序列化；未经编辑的字符串保持原样。

每个实例拥有独立 schema 服务。validation 事件传出 FormValidation，包含 valid、status、errors 和 rootErrors。pending、invalid、error 均不能保存；字段与根级错误都显示。服务异常发出 error，不能当作校验成功。替换数据或 schema 后只应用最新校验结果。

组件默认渲染 form；嵌入宿主现有表单时设置 `embedded`，只渲染字段容器，不产生嵌套 form。保存按钮可放在外部，并使用 validation.valid 控制是否允许保存。消费者可在渲染前使用 `canRenderJsonSchema` 判断是否需要退回原始 JSON 编辑。

数组的添加／移除和可空字段的设置／清除使用 InkButton 的小尺寸次要操作样式。它们只更新表单草稿，不提交外层表单；禁用整个表单时这些操作也不可用。
