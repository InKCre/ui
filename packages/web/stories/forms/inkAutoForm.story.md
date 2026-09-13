# inkAutoForm

InkAutoForm 将扁平 object schema 的 string、number、integer、boolean 映射为现有控件，不提供嵌套或条件表单框架。根 schema 和不支持的字段类型会显示错误。

使用 `v-model:formData` 接收对象。初始化或 schema 改变时只给缺失字段补 default，已有值（包括 0、false、空字符串和 null）优先；schema 中未列出的已有属性保留，是否允许由 schema 校验。外部 formData 更新不重新套默认值，因此清空数字不会被默认值重新填回。

数字使用文本输入以保留未完成的负号或指数，完整值转换为有限 number，无法转换的草稿保留为字符串并产生校验错误；空数字删除该属性，整数和上下界继续由 schema 校验。日期格式保留为 JSON 字符串：date 使用本地日历 YYYY-MM-DD，date-time/datetime 使用 ISO UTC 时间戳，time 使用带 Z 的 UTC 时间。仅在打开 Picker 时转换为 Date，确认才序列化；未经编辑的字符串保持原样。

每个实例拥有独立 schema 服务。validation 事件传出 FormValidation，包含 valid、status、errors 和 rootErrors。pending、invalid、error 均不能保存；字段与根级错误都显示。服务异常发出 error，不能当作校验成功。替换数据或 schema 后只应用最新校验结果。

组件本身已经渲染 form，不应嵌入另一个 form；保存按钮可放在外部，并使用 validation.valid 控制是否允许保存。
