# inkPagination

InkPagination 是受控分页导航，`page-change(number)` 请求父级更新 currentPage。编号按钮带 aria-current，前后按钮有名称且明确使用原生 button 类型，不会提交表单。

非有限页数视为 0，总页数截断为非负整数；显示页码限制在 1 到总页数内。总页数为 0 时显示 0，禁用前后操作且不显示编号。组件不因修正显示而主动发出 page-change；消费者负责让分页数据与页数一致。

页码和导航保留至少 36px 操作区域；文字增长时页码可增宽，整组允许换行。选中页码使用 primary 表面及 on-primary 前景。
